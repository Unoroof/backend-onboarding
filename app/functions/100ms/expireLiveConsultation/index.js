var dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const sendPushNotification = require("../../../functions/neptune/neptuneCaller");
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

const expireLiveConsultation = async () => {
  try {
    const tzTime = moment()
      .utc()
      .tz("asia/kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    console.log("expireLiveConsultation tzTime ", tzTime);

    const videoConsultation = await knex("video_consultations")
      .whereIn("request_status", [
        "buyer_send_request",
        "banker_accepted_the_request",
      ])
      .where("type", "live")
      .where("consultation_end_date_time", "<", tzTime);

    console.log(
      "expireLiveConsultation video consultation uuids",
      videoConsultation.map((item) => item.uuid)
    );

    for (i = 0; i < videoConsultation.length; i++) {
      const consultationRequest = videoConsultation[i];

      let reason = "";
      if (consultationRequest.request_status === "buyer_send_request") {
        reason = "banker not accepted the request";
      }

      if (
        consultationRequest.request_status === "banker_accepted_the_request"
      ) {
        reason = "buyer not done the payment";
      }

      await knex("video_consultations")
        .update({ request_status: "request_expired", expiry_reason: reason })
        .where({ uuid: consultationRequest.uuid });

      let senderProfile = await Profile.findOne({
        where: {
          uuid: consultationRequest.buyer_uuid,
          type: "fm-buyer",
        },
      });

      let receiverProfile = await Profile.findOne({
        where: {
          uuid: consultationRequest.banker_uuid,
          type: "fm-seller",
        },
      });
      await sendPushNotification({
        event_type: "live_consultation_request_is_expired",
        user_id: senderProfile.user_uuid,
        data: {
          requested_by: senderProfile.data.full_name,
          requested_to: receiverProfile.data.full_name,
          notification_type: "banker_has_accepted_the_video_consultation",
        },
        ignore_user_contacts: false,
        contact_infos: [
          {
            type: "email",
            value: receiverProfile.data.email,
          },
          // {
          //   type: "email",
          //   value: "sonali@unoroof.in",
          //   cc: true,
          // },
          // {
          //   type: "email",
          //   value: "manasa@betalectic.com",
          //   cc: true,
          // },
        ],
      });
    }
    await knex.destroy();
    return true;
  } catch (err) {
    console.log("Error while expire live consultation", err);
    await knex.destroy();
  }
};

module.exports = expireLiveConsultation;
