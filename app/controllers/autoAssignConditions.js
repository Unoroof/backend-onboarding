const models = require("../models");
const AutoAssignCondition = models.AutoAssignCondition;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");

module.exports = {
  async create(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-seller",
        },
      });

      let autoAssignCondition = await AutoAssignCondition.create({
        profile_uuid: profile.uuid,
        matching_criteria: req.body.matching_criteria,
        assign_to: req.body.assign_to,
      });

      console.log("check here autoAssignCondition", autoAssignCondition);

      return autoAssignCondition;
    } catch (error) {
      consumeError(error);
    }
  },
};
