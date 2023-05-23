var dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const sendPushNotification = require("../../neptune/neptuneCaller");
const Profile = require("../../../models").Profile;

const moment = require("moment-timezone");

const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    application_name: process.env.APP_NAME || "nobe-runner",
  },
});

const expireTheRequest = async (consultationRequest) => {
  try {
    let reason = "";
    if (consultationRequest.request_status === "source_send_request") {
      reason = "destination not accepted the request";
    }

    if (
      consultationRequest.request_status === "destination_accepted_the_request"
    ) {
      reason = "source not done the payment";
    }

    await knex("video_consultations")
      .update({ request_status: "request_expired", expiry_reason: reason })
      .where({ uuid: consultationRequest.uuid });

    const sourceProfile = await Profile.findByPk(consultationRequest.source);

    const destinationProfile = await Profile.findByPk(
      consultationRequest.destination
    );

    // send the notifications to source and destination
    await sendPushNotification({
      event_type: "destination_has_no_response_video_consultation",
      user_id: sourceProfile.user_uuid,
      data: {
        destination_name: destinationProfile.data?.full_name,
        video_consultation_request: consultationRequest,
        notification_type:
          "destination_has_no_response_video_consultation_firebase",
      },
      ignore_user_contacts: false,
    });

    await sendPushNotification({
      event_type: "destination_has_no_response_video_consultation_own",
      user_id: destinationProfile.user_uuid,
      data: {
        video_consultation_request: consultationRequest,
        notification_type:
          "destination_has_no_response_video_consultation_own_firebase",
      },
      ignore_user_contacts: false,
    });
  } catch (e) {
    console.log("expire the request error", e);
  }
};

const expireGmModuleRequests = async () => {
  try {
    const tzTime = moment()
      .utc()
      .tz("asia/kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    console.log("expireGmModuleRequests tzTime ", tzTime);

    const videoConsultation = await knex("video_consultations")
      .whereIn("request_status", ["source_send_request"])
      .where("type", "live")
      .where("module", "gm_module")
      .where("consultation_end_date_time", "<", tzTime);

    console.log(
      "expireGmModuleRequests video consultation uuids",
      videoConsultation.map((item) => item.uuid)
    );

    for (i = 0; i < videoConsultation.length; i++) {
      const consultationRequest = videoConsultation[i];

      // expire the request
      await expireTheRequest(consultationRequest);
    }
    await knex.destroy();
    return true;
  } catch (err) {
    console.log("Error while expire live consultation", err);
    await knex.destroy();
  }
};

module.exports = expireGmModuleRequests;
// expireGmModuleRequests();
