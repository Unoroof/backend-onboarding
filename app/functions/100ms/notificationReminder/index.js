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

const sendTimeBasedReminderNotification = async () => {
  try {
    console.log("handle sending notification before 1 hr and before 24 hrs");
    const tzTime = moment()
      .utc()
      .tz("asia/kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    //get all the video consultations where buyer has done the payment done
    const videoConsultation = await knex("video_consultations")
      .whereIn("request_status", ["buyer_payment_done"])
      .where("type", "future_date");

    for (i = 0; i < videoConsultation.length; i++) {
      const consultationRequest = videoConsultation[i];

      var videoConsulationdate = JSON.stringify(
        consultationRequest.query_date_time
      ).replaceAll('"', "");

      var convertedConsultationDate = moment(videoConsulationdate).format(
        "YYYY-MM-DD HH:mm:ss"
      );

      var timeForConsultationInHours = moment(convertedConsultationDate).diff(
        moment(tzTime),
        "hours"
      );

      // console.log("hours difference", timeForConsultationInHours);
      var minutesDiff = moment(convertedConsultationDate).diff(
        moment(tzTime),
        "minutes"
      );
      // console.log("Minutes:", minutesDiff);

      let bankerProfile = await Profile.findOne({
        where: {
          uuid: consultationRequest.banker_uuid,
          type: "fm-seller",
        },
      });

      let buyerProfile = await Profile.findOne({
        where: {
          uuid: consultationRequest.buyer_uuid,
          type: "fm-buyer",
        },
      });

      // sending notification to banker and buyer before 24 hr of the consultation
      if (timeForConsultationInHours === +24 && minutesDiff === +1440) {
        console.log(" we are inside sending inside if condition");

        // send reminder to the banker
        await sendPushNotification({
          event_type: "scheduled_consultation_reminder",
          user_id: bankerProfile.user_uuid,
          data: {
            time: timeForConsultationInHours,
            nameOne: bankerProfile.data.full_name,
            nameTwo: buyerProfile.data.full_name,
            profile_uuid: bankerProfile.uuid,
            notification_type: "video_consultation_reminde",
          },
          ignore_user_contacts: false,
          contact_infos: [
            {
              type: "email",
              value: bankerProfile.data.email,
            },
          ],
        });

        //send reminder to buyer

        await sendPushNotification({
          event_type: "scheduled_consultation_reminder",
          user_id: buyerProfile.user_uuid,
          data: {
            time: timeForConsultationInHours,
            nameOne: buyerProfile.data.full_name,
            nameTwo: bankerProfile.data.full_name,
            profile_uuid: buyerProfile.uuid,
            notification_type: "video_consultation_reminder",
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

      // sending notification to banker and buyer before 1 hr of the consultation
      else if (timeForConsultationInHours === +1 && minutesDiff === +60) {
        console.log(" we are inside sending inside if condition");

        // send reminder to the banker
        await sendPushNotification({
          event_type: "scheduled_consultation_reminder",
          user_id: bankerProfile.user_uuid,
          data: {
            time: timeForConsultationInHours,
            nameOne: bankerProfile.data.full_name,
            nameTwo: buyerProfile.data.full_name,
            profile_uuid: bankerProfile.uuid,
            notification_type: "video_consultation_reminde",
          },
          ignore_user_contacts: false,
          contact_infos: [
            {
              type: "email",
              value: bankerProfile.data.email,
            },
          ],
        });

        //send reminder to buyer

        await sendPushNotification({
          event_type: "scheduled_consultation_reminder",
          user_id: buyerProfile.user_uuid,
          data: {
            time: timeForConsultationInHours,
            nameOne: buyerProfile.data.full_name,
            nameTwo: bankerProfile.data.full_name,
            profile_uuid: buyerProfile.uuid,
            notification_type: "video_consultation_reminder",
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
    }
    await knex.destroy();
    return true;

    //now in each min find the time difference between the current time and query_date_time, then if the time difference is 1 hr then trigger the notification.
  } catch (err) {
    console.log("Error in notification reminder", err);
    await knex.destroy();
  }
};

module.exports = sendTimeBasedReminderNotification;
