const models = require("../models");
const AutoAssignCondition = models.AutoAssignConditions;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");

module.exports = {
  async index(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-seller",
        },
      });

      let constraints = {
        where: {
          profile_uuid: profile.uuid,
        },
      };

      let autoAssignConditions = await AutoAssignCondition.findAll(constraints);
      return autoAssignConditions;
    } catch (error) {
      consumeError(error);
    }
  },

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

      return autoAssignCondition;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let payload = {};

      if (req.body.matching_criteria) {
        payload.matching_criteria = req.body.matching_criteria;
      }

      if (req.body.assign_to) {
        payload.assign_to = req.body.assign_to;
      }

      let autoAssignCondition = await AutoAssignCondition.findOne({
        where: {
          uuid: req.params.criteria_uuid,
        },
      });

      console.log("check here update autoAssignCondition", autoAssignCondition);

      let updatedCriteria = await autoAssignCondition.update(payload);
      return updatedCriteria;
    } catch (error) {
      consumeError(error);
    }
  },

  async delete(req, res) {
    try {
      let autoAssignCondition = await AutoAssignCondition.findOne({
        where: {
          uuid: req.params.criteria_uuid,
        },
      });

      let deletedCriteria = await autoAssignCondition.destroy();

      console.log("check here delete autoAssignCondition", deletedCriteria);

      return deletedCriteria;
    } catch (error) {
      consumeError(error);
    }
  },
};
