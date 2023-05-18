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

const paymentKnex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: "backend_payments",
    application_name: process.env.APP_NAME || "nobe-runner",
  },
});

const expireTheRequest = async (consultationRequest) => {
  let reason = "";
  if (consultationRequest.request_status === "buyer_send_request") {
    reason = "destination not accepted the request";
  }

  if (consultationRequest.request_status === "banker_accepted_the_request") {
    reason = "source not done the payment";
  }

  await knex("video_consultations")
    .update({ request_status: "request_expired", expiry_reason: reason })
    .where({ uuid: consultationRequest.uuid });

  const senderProfile = await Profile.findOne({
    where: {
      uuid: consultationRequest.source,
    },
  });

  const receiverProfile = await Profile.findOne({
    where: {
      uuid: consultationRequest.destination,
    },
  });
  await sendPushNotification({
    event_type: "live_consultation_request_is_expired",
    user_id: senderProfile.user_uuid,
    data: {
      requested_by: senderProfile.data.full_name,
      requested_to: receiverProfile.data.full_name,
      notification_type: "your_live_video_consultation_request_is_expired",
    },
    ignore_user_contacts: false,
    contact_infos: [
      {
        type: "email",
        value: senderProfile.data.email,
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
};

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
        "buyer_payment_failed",
      ])
      .where("type", "live")
      .where("consultation_end_date_time", "<", tzTime);

    console.log(
      "expireLiveConsultation video consultation uuids",
      videoConsultation.map((item) => item.uuid)
    );

    for (i = 0; i < videoConsultation.length; i++) {
      const consultationRequest = videoConsultation[i];

      const paymentDetails = await paymentKnex("payments")
        .where("module_id", consultationRequest.uuid)
        .where("module_type", "connect_and_consult_live")
        .orderBy("created_at", "desc")
        .limit(1);

      const latestPaymentDetails = paymentDetails[0];

      if (!latestPaymentDetails) {
        // expire the request
        // it will run when user doesn't click the paynow.
        await expireTheRequest(consultationRequest);
      } else {
        if (latestPaymentDetails.status === "unpaid") {
          const stTime = moment(latestPaymentDetails.created_at).utc();
          const endTime = moment().utc();
          const duration = moment.duration(endTime.diff(stTime));

          if (duration.asMinutes() > 10) {
            // expire the request
            await expireTheRequest(consultationRequest);
          }
        }

        if (latestPaymentDetails.status === "failed") {
          // expire the request
          await expireTheRequest(consultationRequest);
        }
      }
    }
    await knex.destroy();
    await paymentKnex.destroy();
    return true;
  } catch (err) {
    console.log("Error while expire live consultation", err);
    await knex.destroy();
    await paymentKnex.destroy();
  }
};

//expireLiveConsultation();

module.exports = expireLiveConsultation;
