const models = require("../models");
const DailyBids = models.DailyBids;
const Profile = models.Profile;
const BillDiscountProgram = models.BillDiscountProgram;
const consumeError = require("../functions/consumeError");
const updateBidsArray = require("../functions/updateBidsArray");
const { Op } = require("sequelize");

module.exports = {
  async index(req, res) {
    try {
      let dailyBids = await DailyBids.findOne({
        where: {
          uuid: req.params.daily_bids_uuid,
        },
      });
      return dailyBids;
    } catch (error) {
      consumeError(error);
    }
  },

  async getAll(req, res) {
    try {
      let constraints = {
        where: {},
      };

      if (req.query.tenor) {
        let profile = await Profile.findOne({
          where: {
            user_uuid: req.user,
            type: "fm-buyer",
          },
        });

        let userConstraints = {
          where: {
            request_by: profile.uuid,
          },
          attributes: ["daily_bids_uuid"],
        };
        userConstraints.where = {
          data: { joined_program: { tenor: req.query.tenor } },
        };

        let userBillDiscountPrograms = await BillDiscountProgram.findAll(
          userConstraints
        );
        let userBillDiscountProgramsUuids = [];

        userBillDiscountPrograms.forEach((element) => {
          userBillDiscountProgramsUuids.push(element.daily_bids_uuid);
        });

        constraints.where = {
          [Op.and]: [
            {
              bids: {
                [Op.contains]: [{ tenor: req.query.tenor }],
              },
            },
            {
              [Op.not]: {
                bids: {
                  [Op.contains]: [{ tenor: req.query.tenor, discount: "" }],
                },
              },
            },
            {
              [Op.not]: {
                bids: {
                  [Op.contains]: [{ tenor: req.query.tenor, discount: "0" }],
                },
              },
            },
            {
              uuid: {
                [Op.notIn]: userBillDiscountProgramsUuids,
              },
            },
          ],
        };
      }

      if (req.query.profile_uuid)
        constraints.where.profile_uuid = req.query.profile_uuid;

      let dailyBids = await DailyBids.findAll(constraints);

      return dailyBids;
    } catch (error) {
      consumeError(error);
    }
  },

  async create(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      let dailyBids = await DailyBids.create({
        profile_uuid: profile.uuid,
        bids: req.body.bids,
        data: {
          company_name: profile.data.company_name
            ? profile.data.company_name
            : "",
        },
      });

      return dailyBids;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let dailyBids = await DailyBids.findOne({
        where: {
          uuid: req.params.daily_bids_uuid,
        },
      });

      let payload = {};
      if (req.body.bids) {
        payload["bids"] = dailyBids.bids
          ? req.body.bids
            ? updateBidsArray(dailyBids.bids, req.body.bids)
            : dailyBids.bids
          : req.body.bids;
      }

      if (req.body.data) {
        payload["data"] = { ...dailyBids.data, ...req.body.data };
      }

      dailyBids = await dailyBids.update(payload);
      return dailyBids;
    } catch (error) {
      consumeError(error);
    }
  },
};
