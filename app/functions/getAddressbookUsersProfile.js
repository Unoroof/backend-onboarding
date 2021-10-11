const models = require("../models");
const Profile = models.Profile;
const consumeError = require("./consumeError");
const findUserByEmailMobile = require("./findUserByEmailMobile");

module.exports = async (token, addressbookContacts, type = "fm-buyer") => {
  try {
    let addressbookUserProfile = [];
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
                  type: type,
                },
              });
              if (buyerProfile) {
                addressbookUserProfile.push(buyerProfile);
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
                  type: type,
                },
              });
              if (buyerProfile) {
                addressbookUserProfile.push(buyerProfile);
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      })
    );

    return addressbookUserProfile;
  } catch (error) {
    consumeError(error);
  }
};
