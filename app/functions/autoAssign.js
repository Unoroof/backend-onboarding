const models = require("../models");
const AutoAssignCondition = models.AutoAssignConditions;
const Profile = models.Profile;
const consumeError = require("./consumeError");
const findUserByEmailMobile = require("./findUserByEmailMobile");
const getAddressbookUsersProfile = require("./getAddressbookUsersProfile");
const getAddressbookContactsByUserUuid = require("./getAddressbookContactsByUserUuid");

module.exports = async (token, queryResponse) => {
  try {
    let ownerProfile = await Profile.findOne({
      where: {
        uuid: queryResponse.owner_uuid,
      },
    });

    console.log("AutoAssignOwnerProfileUuid", ownerProfile.user_uuid);
    let addressbookContacts = await getAddressbookContactsByUserUuid(
      token,
      ownerProfile.user_uuid
    );

    console.log(
      "AutoAssignAddressbookContacts",
      JSON.stringify(addressbookContacts)
    );

    let addressbookUserProfile = [];
    if (addressbookContacts.length > 0) {
      addressbookUserProfile = await getAddressbookUsersProfile(
        token,
        addressbookContacts
      );
    }

    console.log(
      "AddressbookUserProfile",
      JSON.stringify(addressbookUserProfile)
    );

    let coreBuyer = false;
    if (addressbookUserProfile.length > 0) {
      await addressbookUserProfile.forEach((profile) => {
        if (profile.uuid === queryResponse.profile_uuid) {
          return (coreBuyer = true);
        }
      });
    }

    console.log("coreBuyerValue", coreBuyer);
    if (coreBuyer) {
      let payload = {
        assigned_uuid: queryResponse.owner_uuid,
        data: {
          ...queryResponse.data,
          ...{
            seller_detail: {
              user_uuid: ownerProfile.user_uuid,
              email: ownerProfile.data.email,
              mobile: ownerProfile.data.mobile,
              full_name: ownerProfile.data.full_name,
              company_name: ownerProfile.data.company_name,
            },
          },
        },
      };
      queryResponse = await queryResponse.update(payload);
    } else {
      if (ownerProfile.data.assign_wiredup_leads_to === "me") {
        let payload = {
          assigned_uuid: queryResponse.owner_uuid,
          data: {
            ...queryResponse.data,
            ...{
              seller_detail: {
                user_uuid: ownerProfile.user_uuid,
                email: ownerProfile.data.email,
                mobile: ownerProfile.data.mobile,
                full_name: ownerProfile.data.full_name,
                company_name: ownerProfile.data.company_name,
              },
            },
          },
        };
        queryResponse = await queryResponse.update(payload);
      } else if (ownerProfile.data.assign_wiredup_leads_to === "reject") {
        let payload = {
          assigned_uuid: queryResponse.owner_uuid,
          status: "rejected",
          data: {
            ...queryResponse.data,
            ...{
              seller_detail: {
                user_uuid: ownerProfile.user_uuid,
                email: ownerProfile.data.email,
                mobile: ownerProfile.data.mobile,
                full_name: ownerProfile.data.full_name,
                company_name: ownerProfile.data.company_name,
              },
            },
          },
        };
        queryResponse = await queryResponse.update(payload);
      } else if (ownerProfile.data.assign_wiredup_leads_to === "auto_assign") {
        let autoAssignCondition = await AutoAssignCondition.findAll({
          where: {
            profile_uuid: queryResponse.owner_uuid,
          },
        });

        console.log("check here autoAssignCondition123:", autoAssignCondition);
        if (autoAssignCondition.length === 0) {
          let payload = {
            assigned_uuid: queryResponse.owner_uuid,
            data: {
              ...queryResponse.data,
              ...{
                seller_detail: {
                  user_uuid: ownerProfile.user_uuid,
                  email: ownerProfile.data.email,
                  mobile: ownerProfile.data.mobile,
                  full_name: ownerProfile.data.full_name,
                  company_name: ownerProfile.data.company_name,
                },
              },
            },
          };
          queryResponse = await queryResponse.update(payload);
        } else {
          console.log("check here inside else check");
          await autoAssignCondition.forEach(async (criteria) => {
            if (criteria.assign_to.type === "team_member") {
              console.log("check here inside team mem");
              let payload = {
                email: criteria.assign_to.email,
                mobile: criteria.assign_to.mobile,
              };

              let user = await findUserByEmailMobile(token, payload).catch(
                (error) => {
                  console.log("error", error);
                }
              );
              console.log("check here insdie team_mem user", user);
              if (user) {
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
                    data: {
                      ...queryResponse.data,
                      ...{
                        seller_detail: {
                          user_uuid: sellerProfile.user_uuid,
                          email: sellerProfile.data.email,
                          mobile: sellerProfile.data.mobile,
                          full_name: sellerProfile.data.full_name,
                          company_name: sellerProfile.data.company_name,
                        },
                      },
                    },
                  };
                  queryResponse = await queryResponse.update(payload);
                } else {
                  let payload = {
                    assigned_uuid: queryResponse.owner_uuid,
                    data: {
                      ...queryResponse.data,
                      ...{
                        seller_detail: {
                          user_uuid: ownerProfile.user_uuid,
                          email: ownerProfile.data.email,
                          mobile: ownerProfile.data.mobile,
                          full_name: ownerProfile.data.full_name,
                          company_name: ownerProfile.data.company_name,
                        },
                      },
                    },
                  };
                  queryResponse = await queryResponse.update(payload);
                }
              } else {
                let payload = {
                  assigned_uuid: queryResponse.owner_uuid,
                  data: {
                    ...queryResponse.data,
                    ...{
                      seller_detail: {
                        user_uuid: ownerProfile.user_uuid,
                        email: ownerProfile.data.email,
                        mobile: ownerProfile.data.mobile,
                        full_name: ownerProfile.data.full_name,
                        company_name: ownerProfile.data.company_name,
                      },
                    },
                  },
                };
                queryResponse = await queryResponse.update(payload);
              }
            } else if (criteria.assign_to.type === "location_based") {
              const type = "fm-seller";

              let buyerProfile = await Profile.findOne({
                where: {
                  uuid: queryResponse.profile_uuid,
                },
              });

              let addressbookUserProfile = await getAddressbookUsersProfile(
                token,
                addressbookContacts,
                type
              );

              console.log(
                "check addressbookUserProfile",
                addressbookUserProfile
              );

              let addressbookUserProfileUuid = await addressbookUserProfile.map(
                (profile) => {
                  if (
                    criteria.matching_criteria.range.value ===
                      profile.data.range.value &&
                    buyerProfile.data.city.value === profile.data.city.value &&
                    buyerProfile.data.country.value ===
                      profile.data.country.value
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
                // there would be multiple seller, so picking random seller
                let sellerProfile = await Profile.findOne({
                  where: {
                    uuid: addressbookUserProfileUuid[
                      Math.floor(
                        Math.random() * addressbookUserProfileUuid.length
                      )
                    ],
                  },
                });
                let payload = {
                  assigned_uuid: sellerProfile.uuid,
                  data: {
                    ...queryResponse.data,
                    ...{
                      seller_detail: {
                        user_uuid: sellerProfile.user_uuid,
                        email: sellerProfile.data.email,
                        mobile: sellerProfile.data.mobile,
                        full_name: sellerProfile.data.full_name,
                        company_name: sellerProfile.data.company_name,
                      },
                    },
                  },
                };
                queryResponse = await queryResponse.update(payload);
              }
              // response will be unassigned if there is no seller based on location
            }
          });
        }
      }
    }

    return queryResponse;
  } catch (error) {
    console.log("AutoAssignCheckError", JSON.stringify(error));
    consumeError(error);
  }
};
