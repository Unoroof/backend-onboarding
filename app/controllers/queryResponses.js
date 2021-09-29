const models = require("../models");
const QueryResponse = models.QueryResponse;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");

module.exports = {
  async index(req, res) {
    try {
      // let profile = await Profile.findOne({
      //   where: {
      //     user_uuid: req.user,
      //     type: "fm-buyer",
      //   },
      // });

      let constraints = {
        where: {},
      };

      if (req.query.owner_uuid)
        constraints.where.owner_uuid = req.query.owner_uuid;
      if (req.query.assigned_uuid)
        constraints.where.assigned_uuid = req.query.assigned_uuid;
      if (req.query.query_uuid)
        constraints.where.query_uuid = req.query.query_uuid;
      let queryResponses = await QueryResponse.findAll(constraints);
      return queryResponses;
    } catch (error) {
      consumeError(error);
    }
  },
  async update(req, res) {
    try {
      console.log("check here response_uuid", req.params.response_uuid);
      let queryResponse = await QueryResponse.findOne({
        where: {
          uuid: req.params.response_uuid,
        },
      });

      let payload = {
        query_uuid: queryResponse.query_uuid,
        profile_uuid: queryResponse.profile_uuid,
      };

      if (req.body.status) {
        payload.status = req.body.status;
      }
      if (req.body.assigned_uuid) {
        payload.assigned_uuid = req.body.assigned_uuid;
      }
      if (req.body.data) {
        payload.data = req.body.data
          ? { ...queryResponse.data, ...req.body.data }
          : queryResponse.data;
      }

      queryResponse = await queryResponse.update(payload);
      return true;
    } catch (error) {
      consumeError(error);
    }
  },
};
