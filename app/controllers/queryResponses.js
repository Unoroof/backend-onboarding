const models = require("../models");
const QueryResponse = models.QueryResponse;
const Profile = models.Profile;

module.exports = {
  //   async create(req, res) {
  //     try {
  //       const queryResponse = await QueryResponse.create({
  //         profile_uuid: req.body.user_profile_uuid,
  //         query_uuid: req.body.query_uuid,
  //         status: req.body.status,
  //         data: req.body.data,
  //         owner_uuid: req.body.user_profile_uuid,
  //         assigned_uuid: assigned_uuid,
  //         assigned_to_email: req.body.assigned_to_email,
  //         assigned_to_mobile: req.body.assigned_to_mobile,
  //       });
  //       return queryResponse;
  //     } catch (error) {
  //       consumeError(error);
  //     }
  //   },
};
