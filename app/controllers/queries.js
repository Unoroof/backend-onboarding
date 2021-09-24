const models = require("../models");
const Queries = models.Queries;
const Profile = models.Profile;

module.exports = {
  async index(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      let constraints = {
        where: {
          profile_uuid: profile.uuid,
        },
      };

      if (req.query.type) constraints.where.type = req.query.type;
      if (req.query.status) constraints.where.status = req.query.status;
      let queries = await Queries.findAll(constraints);
      return queries;
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

      const query = await Queries.create({
        profile_uuid: profile.uuid,
        type: req.body.type,
        data: req.body.data,
        status: req.body.status,
      });

      return query;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    console.log("queryuuid======", req.params.query_uuid);
    try {
      let query = await Queries.findOne({
        where: {
          uuid: req.params.query_uuid,
        },
      });

      query = await query.update({
        data: req.body.data ? { ...query.data, ...req.body.data } : query.data,
        status: req.body.status,
      });

      console.log("query=====", query);
      return query;
    } catch (error) {
      consumeError(error);
    }
  },
};
