const models = require("../models");
const DailyBids = models.DailyBids;
const Profile = models.Profile;
const BillDiscountProgram = models.BillDiscountProgram;
const BillDiscountSuppliers = models.BillDiscountSuppliers;
const consumeError = require("../functions/consumeError");
const updateBidsArray = require("../functions/updateBidsArray");
const { Op } = require("sequelize");
const sendPushNotification = require("../functions/neptune/neptuneCaller");
const sendEventOnResponse = require("../functions/sendEventOnResponse");

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
      let userBillDiscountProgramsUuids = [];

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
          request_by: profile.uuid,
          data: { joined_program: { tenor: req.query.tenor } },
        };

        console.log("check here userConstraints: ", userConstraints);

        // get bill  discount program which buyer has joined
        let userBillDiscountPrograms = await BillDiscountProgram.findAll(
          userConstraints
        );

        let joinedPrograms = await BillDiscountSuppliers.findAll({
          where: { invited_by: profile.uuid, status: "accepted" },
          attributes: ["profile_uuid"],
        });

        let joinedProgramUuid = [];

        joinedPrograms.forEach((element) => {
          joinedProgramUuid.push(element.profile_uuid);
        });

        console.log("check here joinedPrograms: ", joinedProgramUuid);

        let usersDailyBids = await DailyBids.findOne({
          where: {
            profile_uuid: profile.uuid,
          },
        });

        console.log("check here usersDailyBids: ", usersDailyBids);

        if (usersDailyBids) {
          userBillDiscountProgramsUuids.push(usersDailyBids.uuid);
        }

        userBillDiscountPrograms.forEach((element) => {
          userBillDiscountProgramsUuids.push(element.daily_bids_uuid);
        });

        console.log(
          "userBillDiscountProgramsUuids>>",
          userBillDiscountProgramsUuids
        );

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
            {
              profile_uuid: {
                [Op.in]: joinedProgramUuid,
              },
            },
            // include the suppliers
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

      console.log("DAILY BIDS CREATED", dailyBids);

      // if (dailyBids) {
      //   await sendPushNotification({
      //     event_type: "bill_discounting_seller_accepts_the_invite",
      //     user_id: bdSupplier.invited_by,
      //     data: {
      //       name: bdSupplier.company_name,
      //       quote_type: "seller_accepted_bill_discounting_invite",
      //       notification_type: "seller_accepts_the_bd_invite",
      //     },
      //   });
      // }

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
