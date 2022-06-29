const models = require("../models");
const DailyBids = models.DailyBids;
const Profile = models.Profile;
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

      if (req.query.profile_uuid)
        constraints.where.profile_uuid = req.query.profile_uuid;

      if (req.query.tenor) {
        constraints.where.bids = {
          [Op.contains]: [{ tenor: req.query.tenor }],
        };
      }

      let dailyBids = await DailyBids.findAll({
        ...constraints,
        order: [["createdAt", "DESC"]],
      });
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
