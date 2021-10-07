const models = require("../models");
const AutoAssignCondition = models.AutoAssignConditions;
const Profile = models.Profile;
const QueryResponse = models.QueryResponse;
const consumeError = require("../functions/consumeError");
const getBuyersLeads = require("../functions/getBuyersLeads");
const { Op, Sequelize } = require("sequelize");
const { async } = require("validate.js");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");

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

  async autoAssign(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-seller",
        },
      });

      let constraints = {
        where: {
          assigned_uuid: profile.uuid,
          createdAt: {
            [Op.lt]: Sequelize.literal(`NOW() - INTERVAL '2 MINUTES'`),
          },
        },
      };

      let queryResponses = await QueryResponse.findAll(constraints);
      let buyersLeads = await getBuyersLeads(req.token, queryResponses);

      let autoAssignCondition = await AutoAssignCondition.findOne({
        where: {
          uuid: req.params.criteria_uuid,
        },
      });

      let emailPayload = {
        email: autoAssignCondition.assign_to.email,
      };

      let user = await findUserByEmailMobile(req.token, emailPayload);

      if (!user) {
        let mobilePayload = {
          mobile: autoAssignCondition.assign_to.mobile,
        };
        user = await findUserByEmailMobile(req.token, mobilePayload);
      }

      let sellerProfile = await Profile.findOne({
        where: {
          user_uuid: user.user_uuid,
          type: "fm-seller",
        },
      });

      buyersLeads.wiredUpGeneratedLeads.map(async (queryResponse) => {
        if (
          parseInt(autoAssignCondition.matching_criteria.range.min_value) <=
          parseInt(queryResponse.data.outstanding_loan_amount) <=
          parseInt(autoAssignCondition.matching_criteria.range.max_value)
        ) {
          let payload = {
            assigned_uuid: sellerProfile.uuid,
          };
          queryResponse = await queryResponse.update(payload);
        }
      });

      console.log("check here ", autoAssignCondition);
      return autoAssignCondition;
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
