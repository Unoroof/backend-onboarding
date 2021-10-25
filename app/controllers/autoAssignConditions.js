const models = require("../models");
const AutoAssignCondition = models.AutoAssignConditions;
const Profile = models.Profile;
const QueryResponse = models.QueryResponse;
const consumeError = require("../functions/consumeError");
const getBuyersLeads = require("../functions/getBuyersLeads");
const { Op, Sequelize } = require("sequelize");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");
const getAddressbookUsersProfile = require("../functions/getAddressbookUsersProfile");
const getAddressbookContacts = require("../functions/getAddressbookContacts");

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

      if (req.body.assign_to.type === "team_member") {
        req.body.assign_to.name = profile.data.full_name;
        req.body.assign_to.location = {
          country: profile.data.country,
          city: profile.data.city,
        };
      }

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

      let autoAssignCondition = await AutoAssignCondition.findOne({
        where: {
          uuid: req.params.criteria_uuid,
        },
      });

      if (req.body.matching_criteria) {
        payload.matching_criteria = Object.assign(
          req.body.matching_criteria,
          autoAssignCondition.matching_criteria
        );
      }

      if (req.body.assign_to) {
        payload.assign_to = Object.assign(
          req.body.assign_to,
          autoAssignCondition.assign_to
        );
      }

      if (req.body.assign_to.type === "team_member") {
        req.body.assign_to.name = profile.data.full_name;
        req.body.assign_to.location = {
          country: profile.data.country,
          city: profile.data.city,
        };
      }

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
      let buyersLeads = await getBuyersLeads(req.token, queryResponses); // change name

      let autoAssignCondition = await AutoAssignCondition.findOne({
        where: {
          uuid: req.params.criteria_uuid,
        },
      });
      if (autoAssignCondition.assign_to.type === "team_member") {
        let payload = {
          email: autoAssignCondition.assign_to.email,
          mobile: autoAssignCondition.assign_to.mobile,
        };

        let user = await findUserByEmailMobile(req.token, payload);

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
      } else if (autoAssignCondition.assign_to.type === "location_based") {
        const addressbookContacts = await getAddressbookContacts(req.token);

        const type = "fm-seller";
        let addressbookUserProfile = await getAddressbookUsersProfile(
          req.token,
          addressbookContacts,
          type
        );

        console.log("check addressbookUserProfile", addressbookUserProfile);

        let addressbookUserProfileUuid = await addressbookUserProfile.map(
          (profile) => {
            if (
              parseInt(
                autoAssignCondition.matching_criteria.range.min_value
              ) === parseInt(profile.data.range.min_value) &&
              parseInt(
                autoAssignCondition.matching_criteria.range.max_value
              ) === parseInt(profile.data.range.max_value) &&
              autoAssignCondition.matching_criteria.city.label ===
                profile.data.city.label &&
              autoAssignCondition.matching_criteria.country.label ===
                profile.data.country.label
            ) {
              return profile.uuid;
            }
          }
        );
        console.log(
          "check addressbookUserProfileUuid",
          addressbookUserProfileUuid
        );

        // now have 10 queryresponse which will be devided equally to allthe addressbookUserProfileUuid
        // await buyersLeads.wiredUpGeneratedLeads.map((queryResponse) => {});
        let dividedQueryResponses = generateArrayWithLimit(
          buyersLeads.wiredUpGeneratedLeads,
          addressbookUserProfileUuid.length
        );

        console.log("check here dividedQueryResponses", dividedQueryResponses);

        for (var i = 0; i < addressbookUserProfileUuid.length; i++) {
          dividedQueryResponses[0].map(async (queryResponse) => {
            let payload = {
              assigned_uuid: addressbookUserProfileUuid[i],
            };

            await queryResponse.update(payload);
          });
        }
      }

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

const generateArrayWithLimit = (data, limit) => {
  var index = 0;
  var arrayLength = data.length;
  var tempArray = [];

  for (index = 0; index < arrayLength; index += limit) {
    myChunk = data.slice(index, index + limit);
    tempArray.push(myChunk);
  }

  return tempArray;
};
