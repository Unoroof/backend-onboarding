const models = require("../models");
const Profile = models.Profile;
const consumeError = require("./consumeError");
const getAddressbookContacts = require("./getAddressbookContacts");
const findUserByEmailMobile = require("./findUserByEmailMobile");

module.exports = async (token, queryResponses) => {
  try {
    const addressbookContacts = await getAddressbookContacts(token);

    let addressbookUserProfileUuids = await getAddressbookUserProfilUuids(
      token,
      addressbookContacts
    );

    console.log(
      "check here:addressbookUserProfileUuids:",
      addressbookUserProfileUuids
    );
    let coreBuyerLeads = [];

    await queryResponses.map(async (response) => {
      await addressbookUserProfileUuids.map((profileUuid) => {
        if (response.profile_uuid === profileUuid) {
          coreBuyerLeads.push(response);
        }
      });
    });

    console.log("check here coreBuyerLeads:", coreBuyerLeads);

    let wiredUpGeneratedLeads = await diffArray(queryResponses, coreBuyerLeads);

    console.log("check here wiredUpGeneratedLeads:", wiredUpGeneratedLeads);

    let buyers = {
      coreBuyerLeads: coreBuyerLeads,
      wiredUpGeneratedLeads: wiredUpGeneratedLeads,
    };

    return buyers;
  } catch (error) {
    consumeError(error);
  }
};

const getAddressbookUserProfilUuids = async (token, addressbookContacts) => {
  try {
    let addressbookUserProfileUuids = [];
    await Promise.all(
      await addressbookContacts.map(async (contact) => {
        if (contact.email) {
          let payload = {
            email: contact.email,
          };

          await findUserByEmailMobile(token, payload)
            .then(async (res) => {
              let buyerProfile = await Profile.findOne({
                where: {
                  user_uuid: res.user_uuid,
                  type: "fm-buyer",
                },
              });
              if (buyerProfile) {
                addressbookUserProfileUuids.push(buyerProfile.uuid);
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }

        if (contact.mobile) {
          let payload = {
            mobile: contact.mobile,
          };

          await findUserByEmailMobile(token, payload)
            .then(async (res) => {
              let buyerProfile = await Profile.findOne({
                where: {
                  user_uuid: res.user_uuid,
                  type: "fm-buyer",
                },
              });
              if (buyerProfile) {
                addressbookUserProfileUuids.push(buyerProfile.uuid);
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      })
    );

    return addressbookUserProfileUuids;
  } catch (error) {
    consumeError(error);
  }
};

const diffArray = (arr1, arr2) => {
  return arr1
    .concat(arr2)
    .filter((item) => !arr1.includes(item) || !arr2.includes(item));
};
