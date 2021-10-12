const models = require("../models");
const AutoAssignCondition = models.AutoAssignConditions;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");
const getAddressbookUsersProfile = require("../functions/getAddressbookUsersProfile");
const getAddressbookContactsByUserUuid = require("../functions/getAddressbookContactsByUserUuid");

module.exports = async (token, queryResponse) => {
  try {
    let ownerProfile = await Profile.findOne({
      where: {
        uuid: queryResponse.owner_uuid,
      },
    });

    console.log("check here ownerProfile", ownerProfile.user_uuid);
    let addressbookContacts = await getAddressbookContactsByUserUuid(
      token,
      ownerProfile.user_uuid
    );

    let addressbookUserProfile = await getAddressbookUsersProfile(
      token,
      addressbookContacts
    );

    console.log("check addressbookUserProfile", addressbookUserProfile);
    let coreBuyer = false;
    if (addressbookUserProfile) {
      await addressbookUserProfile.forEach((profile) => {
        if (profile.uuid === queryResponse.profile_uuid) {
          return (coreBuyer = true);
        }
      });
    }

    console.log("check here condition:", coreBuyer);
    if (coreBuyer) {
      let payload = {
        assigned_uuid: queryResponse.owner_uuid,
      };
      queryResponse = await queryResponse.update(payload);
    } else {
      let autoAssignCondition = await AutoAssignCondition.findAll({
        where: {
          profile_uuid: queryResponse.owner_uuid,
        },
      });

      console.log("check here autoAssignCondition123:", autoAssignCondition);
      if (autoAssignCondition.length === 0) {
        let payload = {
          assigned_uuid: queryResponse.owner_uuid,
        };
        queryResponse = await queryResponse.update(payload);
      } else {
        await autoAssignCondition.forEach(async (criteria) => {
          if (criteria.assign_to.type === "team_member") {
            let payload = {
              email: criteria.assign_to.email,
              mobile: criteria.assign_to.mobile,
            };

            let user = await findUserByEmailMobile(token, payload);

            let sellerProfile = await Profile.findOne({
              where: {
                user_uuid: user.user_uuid,
                type: "fm-seller",
              },
            });

            console.log("check here sellerProfile:", sellerProfile);

            if (
              parseInt(criteria.matching_criteria.range.min_value) <=
              parseInt(queryResponse.data.outstanding_loan_amount) <=
              parseInt(criteria.matching_criteria.range.max_value)
            ) {
              let payload = {
                assigned_uuid: sellerProfile.uuid,
              };
              queryResponse = await queryResponse.update(payload);
            } else {
              let payload = {
                assigned_uuid: queryResponse.owner_uuid,
              };
              queryResponse = await queryResponse.update(payload);
            }
          } else if (criteria.assign_to.type === "location_based") {
            const type = "fm-seller";
            let addressbookUserProfile = await getAddressbookUsersProfile(
              token,
              addressbookContacts,
              type
            );

            console.log("check addressbookUserProfile", addressbookUserProfile);

            let addressbookUserProfileUuid = await addressbookUserProfile.map(
              (profile) => {
                if (
                  parseInt(criteria.matching_criteria.range.min_value) ===
                    parseInt(profile.data.range.min_value) &&
                  parseInt(criteria.matching_criteria.range.max_value) ===
                    parseInt(profile.data.range.max_value) &&
                  criteria.matching_criteria.city.label ===
                    profile.data.city.label &&
                  criteria.matching_criteria.country.label ===
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
            if (addressbookUserProfileUuid.length !== 0) {
              let payload = {
                assigned_uuid: addressbookUserProfileUuid[0],
              };

              queryResponse = await queryResponse.update(payload);
            } else {
              let payload = {
                assigned_uuid: queryResponse.owner_uuid,
              };
              queryResponse = await queryResponse.update(payload);
            }
          }
        });
      }
    }

    return queryResponse;
  } catch (error) {
    consumeError(error);
  }
};
