const models = require("../models");
const Profile = models.Profile;
const sendPushNotification = require("./neptune/neptuneCaller");

module.exports = async (users_profile_uuid, company_name, event_type) => {
  try {
    const user_uuid_array = [];
    for (let i = 0; i < users_profile_uuid.length; i++) {
      const user_profile = await Profile.findOne({
        where: {
          uuid: users_profile_uuid[i],
        },
      });
      if (user_profile.user_uuid) {
        user_uuid_array.push(user_profile.user_uuid);
      }
    }

    user_uuid_array.map(async (user_uuid) => {
      await sendPushNotification({
        event_type: event_type,
        user_id: user_uuid,
        data: {
          name: company_name,
        },
        ignore_user_contacts: false,
      });
    });
  } catch (error) {
    console.log("Error in sending neptune calls>", e);
  }
};
