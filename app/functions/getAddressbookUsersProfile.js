const models = require("../models");
const Profile = models.Profile;
const consumeError = require("./consumeError");
const findUserByEmailMobile = require("./findUserByEmailMobile");

module.exports = async (token, addressbookContacts, type = "fm-buyer") => {
  try {
    let addressbookUserProfile = [];
    await Promise.all(
      await addressbookContacts.map(async (contact) => {
        let payload = {
          email: contact.email,
          mobile: contact.mobile,
        };

        await findUserByEmailMobile(token, payload)
          .then(async (res) => {
            let profile = await Profile.findOne({
              where: {
                user_uuid: res.user_uuid,
                type: type,
              },
            });
            if (profile) {
              addressbookUserProfile.push(profile);
            }
          })
          .catch((error) => {
            console.log("error", error);
          });
      })
    );

    return addressbookUserProfile;
  } catch (error) {
    consumeError(error);
  }
};
