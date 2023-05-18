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

const expireFutureConsultation = async () => {
  try {
    const tzTime = moment()
      .utc()
      .tz("asia/kolkata")
      .add(1, "hour")
      .format("YYYY-MM-DD HH:mm:ss");

    console.log("expireFutureConsultation tzTime ", tzTime);

    const videoConsultation = await knex("video_consultations")
      .whereIn("request_status", [
        "buyer_send_request",
        "banker_accepted_the_request",
      ])
      .where("type", "future_date")
      .where("query_date_time", "<", tzTime);

    console.log(
      "expireFutureConsultation video consultation uuids",
      videoConsultation.map((item) => item.uuid)
    );

    for (i = 0; i < videoConsultation.length; i++) {
      const consultationRequest = videoConsultation[i];

      let reason = "";

      if (consultationRequest.request_status === "buyer_send_request") {
        reason = "destination not accepted the request";
      }

      if (
        consultationRequest.request_status === "banker_accepted_the_request"
      ) {
        reason = "source not done the payment";
      }

      await knex("video_consultations")
        .update({ request_status: "request_expired", expiry_reason: reason })
        .where({ uuid: consultationRequest.uuid });

      let buyerProfile = await Profile.findOne({
        where: {
          uuid: consultationRequest.source,
        },
      });

      let bankerProfile = await Profile.findOne({
        where: {
          uuid: consultationRequest.destination,
        },
      });

      await sendPushNotification({
        event_type: "future_date_consultation_request_is_expired",
        user_id: buyerProfile.user_uuid,
        data: {
          buyer_name: buyerProfile.data.full_name,
          banker_name: bankerProfile.data.full_name,
          profile_uuid: buyerProfile.uuid,
          notification_type:
            "your_future_date_video_consultation_request_is_expired",
        },
        ignore_user_contacts: false,
        contact_infos: [
          {
            type: "email",
            value: buyerProfile.data.email,
          },
        ],
      });
    }
    await knex.destroy();
    return true;
  } catch (err) {
    console.log("Error while expire future consultation", err);
    await knex.destroy();
  }
};

module.exports = expireFutureConsultation;
