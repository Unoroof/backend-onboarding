const models = require("../models");
const AutoAssignCondition = models.AutoAssignConditions;
const Profile = models.Profile;
const consumeError = require("./consumeError");
const findUserByEmailMobile = require("./findUserByEmailMobile");
const getAddressbookUsersProfile = require("./getAddressbookUsersProfile");
const getAddressbookContactsByUserUuid = require("./getAddressbookContactsByUserUuid");
const sendPushNotification = require("./neptune/neptuneCaller");

module.exports = async (token, queryResponse) => {
  try {
    let ownerProfile = await Profile.findOne({
      where: {
        uuid: queryResponse.owner_uuid,
      },
    });

    let buyerProfile = await Profile.findOne({
      where: {
        uuid: queryResponse.profile_uuid,
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
              bank_name:
                ownerProfile.data.additional_company_details &&
                ownerProfile.data.additional_company_details.bank_name
                  ? ownerProfile.data.additional_company_details.bank_name
                  : "",
            },
          },
        },
      };
      queryResponse = await queryResponse.update(payload);
      console.log("checkhereownerProfile.user_uuid", ownerProfile.user_uuid);
      if (queryResponse.query_type === "refinance_existing_loan") {
        await sendPushNotification({
          event_type: "seller_received_a_financing_query",
          user_id: ownerProfile.user_uuid, // user id of person whome to send query
          data: {
            name: buyerProfile.data.full_name, // enquiry.data.name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            buyer_profile_uuid: queryResponse.profile_uuid,
            ...queryResponse.data,
            notification_type: "seller_received_a_financing_query", //query detail page
          },
        });
      } else {
        await sendPushNotification({
          event_type: "seller_received_a_non_financing_query",
          user_id: ownerProfile.user_uuid, // user id of person whome to send query
          data: {
            name: buyerProfile.data.full_name, // enquiry.data.name,
            query_type: "non-financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            buyer_profile_uuid: queryResponse.profile_uuid,
            ...queryResponse.data,
            notification_type: "seller_received_a_non_financing_query", //query detail page
          },
        });
      }
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
                bank_name:
                  ownerProfile.data.additional_company_details &&
                  ownerProfile.data.additional_company_details.bank_name
                    ? ownerProfile.data.additional_company_details.bank_name
                    : "",
              },
            },
          },
        };
        queryResponse = await queryResponse.update(payload);
        if (queryResponse.query_type === "refinance_existing_loan") {
          await sendPushNotification({
            event_type: "seller_received_a_financing_query",
            user_id: ownerProfile.user_uuid, // user id of person whome to send query
            data: {
              name: buyerProfile.data.full_name, // enquiry.data.name,
              query_type: "financing",
              query_uuid: queryResponse.query_uuid,
              query_response_uuid: queryResponse.uuid,
              buyer_profile_uuid: queryResponse.profile_uuid,
              ...queryResponse.data,
              notification_type: "seller_received_a_financing_query", //query detail page
            },
          });
        } else {
          await sendPushNotification({
            event_type: "seller_received_a_non_financing_query",
            user_id: ownerProfile.user_uuid, // user id of person whome to send query
            data: {
              name: buyerProfile.data.full_name, // enquiry.data.name,
              query_type: "non-financing",
              query_uuid: queryResponse.query_uuid,
              query_response_uuid: queryResponse.uuid,
              buyer_profile_uuid: queryResponse.profile_uuid,
              ...queryResponse.data,
              notification_type: "seller_received_a_non_financing_query", //query detail page
            },
          });
        }
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
                bank_name:
                  ownerProfile.data.additional_company_details &&
                  ownerProfile.data.additional_company_details.bank_name
                    ? ownerProfile.data.additional_company_details.bank_name
                    : "",
              },
            },
          },
        };
        queryResponse = await queryResponse.update(payload);
        if (queryResponse.query_type === "refinance_existing_loan") {
          await sendPushNotification({
            event_type: "seller_received_a_financing_query",
            user_id: ownerProfile.user_uuid, // user id of person whome to send query
            data: {
              name: buyerProfile.data.full_name, // enquiry.data.name,
              query_type: "financing",
              query_uuid: queryResponse.query_uuid,
              query_response_uuid: queryResponse.uuid,
              buyer_profile_uuid: queryResponse.profile_uuid,
              ...queryResponse.data,
              notification_type: "seller_received_a_financing_query", //query detail page
            },
          });
        } else {
          await sendPushNotification({
            event_type: "seller_received_a_non_financing_query",
            user_id: ownerProfile.user_uuid, // user id of person whome to send query
            data: {
              name: buyerProfile.data.full_name, // enquiry.data.name,
              query_type: "non-financing",
              query_uuid: queryResponse.query_uuid,
              query_response_uuid: queryResponse.uuid,
              buyer_profile_uuid: queryResponse.profile_uuid,
              ...queryResponse.data,
              notification_type: "seller_received_a_non_financing_query", //query detail page
            },
          });
        }
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
                  bank_name:
                    ownerProfile.data.additional_company_details &&
                    ownerProfile.data.additional_company_details.bank_name
                      ? ownerProfile.data.additional_company_details.bank_name
                      : "",
                },
              },
            },
          };
          queryResponse = await queryResponse.update(payload);
          if (queryResponse.query_type === "refinance_existing_loan") {
            await sendPushNotification({
              event_type: "seller_received_a_financing_query",
              user_id: ownerProfile.user_uuid, // user id of person whome to send query
              data: {
                name: buyerProfile.data.full_name, // enquiry.data.name,
                query_type: "financing",
                query_uuid: queryResponse.query_uuid,
                query_response_uuid: queryResponse.uuid,
                buyer_profile_uuid: queryResponse.profile_uuid,
                ...queryResponse.data,
                notification_type: "seller_received_a_financing_query", //query detail page
              },
            });
          } else {
            await sendPushNotification({
              event_type: "seller_received_a_non_financing_query",
              user_id: ownerProfile.user_uuid, // user id of person whome to send query
              data: {
                name: buyerProfile.data.full_name, // enquiry.data.name,
                query_type: "non-financing",
                query_uuid: queryResponse.query_uuid,
                query_response_uuid: queryResponse.uuid,
                buyer_profile_uuid: queryResponse.profile_uuid,
                ...queryResponse.data,
                notification_type: "seller_received_a_non_financing_query", //query detail page
              },
            });
          }
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
                          bank_name:
                            sellerProfile.data.additional_company_details &&
                            sellerProfile.data.additional_company_details
                              .bank_name
                              ? sellerProfile.data.additional_company_details
                                  .bank_name
                              : "",
                        },
                      },
                    },
                  };
                  queryResponse = await queryResponse.update(payload);
                  if (queryResponse.query_type === "refinance_existing_loan") {
                    await sendPushNotification({
                      event_type: "seller_received_a_financing_query",
                      user_id: sellerProfile.user_uuid, // user id of person whome to send query
                      data: {
                        name: buyerProfile.data.full_name, // enquiry.data.name,
                        query_type: "financing",
                        query_uuid: queryResponse.query_uuid,
                        query_response_uuid: queryResponse.uuid,
                        buyer_profile_uuid: queryResponse.profile_uuid,
                        ...queryResponse.data,
                        notification_type: "seller_received_a_financing_query", //query detail page
                      },
                    });
                  } else {
                    await sendPushNotification({
                      event_type: "seller_received_a_non_financing_query",
                      user_id: sellerProfile.user_uuid, // user id of person whome to send query
                      data: {
                        name: buyerProfile.data.full_name, // enquiry.data.name,
                        query_type: "non-financing",
                        query_uuid: queryResponse.query_uuid,
                        query_response_uuid: queryResponse.uuid,
                        buyer_profile_uuid: queryResponse.profile_uuid,
                        ...queryResponse.data,
                        notification_type:
                          "seller_received_a_non_financing_query",
                      },
                    });
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
                          bank_name:
                            ownerProfile.data.additional_company_details &&
                            ownerProfile.data.additional_company_details
                              .bank_name
                              ? ownerProfile.data.additional_company_details
                                  .bank_name
                              : "",
                        },
                      },
                    },
                  };
                  queryResponse = await queryResponse.update(payload);
                  if (queryResponse.query_type === "refinance_existing_loan") {
                    await sendPushNotification({
                      event_type: "seller_received_a_financing_query",
                      user_id: ownerProfile.user_uuid, // user id of person whome to send query
                      data: {
                        name: buyerProfile.data.full_name, // enquiry.data.name,
                        query_type: "financing",
                        query_uuid: queryResponse.query_uuid,
                        query_response_uuid: queryResponse.uuid,
                        buyer_profile_uuid: queryResponse.profile_uuid,
                        ...queryResponse.data,
                        notification_type: "seller_received_a_financing_query", //query detail page
                      },
                    });
                  } else {
                    await sendPushNotification({
                      event_type: "seller_received_a_non_financing_query",
                      user_id: ownerProfile.user_uuid, // user id of person whome to send query
                      data: {
                        name: buyerProfile.data.full_name, // enquiry.data.name,
                        query_type: "non-financing",
                        query_uuid: queryResponse.query_uuid,
                        query_response_uuid: queryResponse.uuid,
                        buyer_profile_uuid: queryResponse.profile_uuid,
                        ...queryResponse.data,
                        notification_type:
                          "seller_received_a_non_financing_query", //query detail page
                      },
                    });
                  }
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
                        bank_name:
                          ownerProfile.data.additional_company_details &&
                          ownerProfile.data.additional_company_details.bank_name
                            ? ownerProfile.data.additional_company_details
                                .bank_name
                            : "",
                      },
                    },
                  },
                };
                queryResponse = await queryResponse.update(payload);
                if (queryResponse.query_type === "refinance_existing_loan") {
                  await sendPushNotification({
                    event_type: "seller_received_a_financing_query",
                    user_id: ownerProfile.user_uuid, // user id of person whome to send query
                    data: {
                      name: buyerProfile.data.full_name, // enquiry.data.name,
                      query_type: "financing",
                      query_uuid: queryResponse.query_uuid,
                      query_response_uuid: queryResponse.uuid,
                      buyer_profile_uuid: queryResponse.profile_uuid,
                      ...queryResponse.data,
                      notification_type: "seller_received_a_financing_query", //query detail page
                    },
                  });
                } else {
                  await sendPushNotification({
                    event_type: "seller_received_a_non_financing_query",
                    user_id: ownerProfile.user_uuid,
                    data: {
                      name: buyerProfile.data.full_name,
                      query_type: "non-financing",
                      query_uuid: queryResponse.query_uuid,
                      query_response_uuid: queryResponse.uuid,
                      buyer_profile_uuid: queryResponse.profile_uuid,
                      ...queryResponse.data,
                      notification_type:
                        "seller_received_a_non_financing_query",
                    },
                  });
                }
              }
            } else if (criteria.assign_to.type === "location_based") {
              const type = "fm-seller";

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
                        bank_name:
                          sellerProfile.data.additional_company_details &&
                          sellerProfile.data.additional_company_details
                            .bank_name
                            ? sellerProfile.data.additional_company_details
                                .bank_name
                            : "",
                      },
                    },
                  },
                };
                queryResponse = await queryResponse.update(payload);
                if (queryResponse.query_type === "refinance_existing_loan") {
                  await sendPushNotification({
                    event_type: "seller_received_a_financing_query",
                    user_id: sellerProfile.user_uuid,
                    data: {
                      name: buyerProfile.data.full_name,
                      query_type: "financing",
                      query_uuid: queryResponse.query_uuid,
                      query_response_uuid: queryResponse.uuid,
                      buyer_profile_uuid: queryResponse.profile_uuid,
                      ...queryResponse.data,
                      notification_type: "seller_received_a_financing_query",
                    },
                  });
                } else {
                  await sendPushNotification({
                    event_type: "seller_received_a_non_financing_query",
                    user_id: sellerProfile.user_uuid,
                    data: {
                      name: buyerProfile.data.full_name,
                      query_type: "non-financing",
                      query_uuid: queryResponse.query_uuid,
                      query_response_uuid: queryResponse.uuid,
                      buyer_profile_uuid: queryResponse.profile_uuid,
                      ...queryResponse.data,
                      notification_type:
                        "seller_received_a_non_financing_query",
                    },
                  });
                }
              } else {
                // response will be unassigned if there is no seller based on location
                if (queryResponse.query_type === "refinance_existing_loan") {
                  await sendPushNotification({
                    event_type:
                      "seller_auto_assign_criteria_mismatched_for_a_financing_query",
                    user_id: queryResponse.data.seller_detail.user_uuid,
                    data: {
                      name: buyerProfile.data.full_name,
                      query_type: "financing",
                      query_uuid: queryResponse.query_uuid,
                      ...queryResponse.data,
                      notification_type:
                        "seller_auto_assign_criteria_mismatched_for_a_financing_query",
                    },
                  });
                } else {
                  await sendPushNotification({
                    event_type:
                      "seller_auto_assign_criteria_mismatched_for_a_non_financing_query",
                    user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send query
                    data: {
                      name: buyerProfile.data.full_name, // enquiry.data.name,
                      query_type: "non-financing",
                      query_uuid: queryResponse.query_uuid,
                      ...queryResponse.data,
                      notification_type:
                        "seller_auto_assign_criteria_mismatched_for_a_non_financing_query", //query detail page
                    },
                  });
                }
              }
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
