const models = require("../models");
const AutoAssignCondition = models.AutoAssignConditions;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");
const getAddressbookUsersProfile = require("../functions/getAddressbookUsersProfile");
const getAddressbookContacts = require("../functions/getAddressbookContacts");

module.exports = (queryResponse, req, res) => {
  try {
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
            parseInt(autoAssignCondition.matching_criteria.range.min_value) ===
              parseInt(profile.data.range.min_value) &&
            parseInt(autoAssignCondition.matching_criteria.range.max_value) ===
              parseInt(profile.data.range.max_value) &&
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

      let payload = {
        assigned_uuid: addressbookUserProfileUuid[0],
      };

      await queryResponse.update(payload);
    }

    return autoAssignCondition;
  } catch (error) {
    consumeError(error);
  }
};
