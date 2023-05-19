const moment = require("moment-timezone");
const { Op } = require("sequelize");

const sendPushNotification = require("../../functions/neptune/neptuneCaller");
const Models = require("../../models");
const adminContacts = require("../../static/adminContacts");

const Profile = Models.Profile;
const VideoConsultation = Models.VideoConsultation;

async function afterRespondCreateVideoConsultation(context) {
  const { locoAction } = context;

  // this notification will be triggered when buyer raises request for both future date and live consultations.

  let senderProfile = await Profile.findOne({
    where: {
      uuid: locoAction["payload"]["source"],
    },
  });

  let receiverProfile = await Profile.findOne({
    where: {
      uuid: locoAction["payload"]["destination"],
    },
  });

  if (locoAction["payload"]["module"] === "gm_module") {
    const videoConsultationRequestData = locoAction.opResult;

    await sendPushNotification({
      event_type: "source_has_requested_video_consultation",
      user_id: receiverProfile.user_uuid,
      data: {
        source_name: senderProfile.data.full_name,
        destination_name: receiverProfile.data.full_name,
        video_consultation_request: videoConsultationRequestData,
        notification_type: "source_has_requested_video_consultation_firebase",
      },
      ignore_user_contacts: false,
    });
  } else {
    await sendPushNotification({
      event_type: "buyer_has_requested_video_consultation",
      user_id: receiverProfile.user_uuid,
      data: {
        requested_by: senderProfile.data.full_name,
        requested_to: receiverProfile.data.full_name,
        type: locoAction["payload"]["type"],
        notification_type: "buyer_has_requested_for_video_consultation",
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

  return context;
}

async function afterRespondPatchVideoConsultation(context) {
  const { locoAction } = context;

  const payload = locoAction.payload;

  if (payload.uuid) {
    const videoConsultationRequestData = locoAction.opResult;

    const receiverProfile = await Profile.findByPk(
      videoConsultationRequestData.source
    );
    const senderProfile = await Profile.findByPk(
      videoConsultationRequestData.destination
    );

    if (videoConsultationRequestData.module === "gm_module") {
      const sourceProfile = receiverProfile;
      const destinationProfile = senderProfile;

      if (
        payload.destination_accepted_on &&
        videoConsultationRequestData.request_status ===
          "destination_accepted_the_request"
      ) {
        // destination Accepted push and app notification
        await sendPushNotification({
          event_type: "destination_has_accepted_video_consultation",
          user_id: sourceProfile.user_uuid,
          data: {
            destination_name: destinationProfile.data?.full_name,
            video_consultation_request: videoConsultationRequestData,
            notification_type:
              "destination_has_accepted_video_consultation_firebase",
          },
          ignore_user_contacts: false,
        });

        await sendPushNotification({
          event_type: "destination_has_accepted_video_consultation_own",
          user_id: destinationProfile.user_uuid,
          data: {
            video_consultation_request: videoConsultationRequestData,
            source_name: sourceProfile.data?.full_name,
            notification_type:
              "destination_has_accepted_video_consultation_own_firebase",
          },
          ignore_user_contacts: false,
        });
      }

      if (
        payload.destination_rejected_on &&
        videoConsultationRequestData.request_status ===
          "destination_rejected_the_request"
      ) {
        // destination rejected push and app notification
        await sendPushNotification({
          event_type: "destination_has_no_response_video_consultation",
          user_id: sourceProfile.user_uuid,
          data: {
            destination_name: destinationProfile.data?.full_name,
            video_consultation_request: videoConsultationRequestData,
            notification_type:
              "destination_has_no_response_video_consultation_firebase",
          },
          ignore_user_contacts: false,
        });

        await sendPushNotification({
          event_type: "destination_has_no_response_video_consultation_own",
          user_id: destinationProfile.user_uuid,
          data: {
            video_consultation_request: videoConsultationRequestData,
            notification_type:
              "destination_has_no_response_video_consultation_own_firebase",
          },
          ignore_user_contacts: false,
        });
      }
    } else {
      // this notification will be triggered both when buyer has done the payment for both future date consultations and live consultation.

      if (locoAction["opResult"]["request_status"] === "buyer_payment_done") {
        await sendPushNotification({
          event_type: "buyer_has_paid_for_the_consultation",
          user_id: senderProfile.user_uuid,
          data: {
            requested_by: receiverProfile.data.full_name,
            requested_to: senderProfile.data.full_name,
            type: locoAction["opResult"]["type"],
            notification_type: "buyer_has_paid_for_the_video_consultation",
            consultation_amount:
              locoAction["opResult"]["payment_details"]["amount"],
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
      } else if (
        locoAction["opResult"]["request_status"] ===
        "banker_rejected_the_request"
      ) {
        // this notification will be triggered both when banker rejects the buyers consulation request  for both future date consultations and live consultation.

        console.log("we are in push notification for the rejected status");
        await sendPushNotification({
          event_type: "banker_rejected_the_video_consultation",
          user_id: receiverProfile.user_uuid,
          data: {
            requested_by: receiverProfile.data.full_name,
            requested_to: senderProfile.data.full_name,
            type: locoAction["opResult"]["type"],
            notification_type: "banker_has_cancelled_the_video_consultation",
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
          // contact_infos: adminContacts,
        });
      } else if (
        locoAction["opResult"]["request_status"] ===
        "banker_accepted_the_request"
      ) {
        // this notification will be triggered both when banker accepts the buyers consulation request  for both future date consultations and live consultation.

        console.log("we are in push notification for the accepted status");
        await sendPushNotification({
          event_type: "Buyer_has_accepted_the_video_consultation_request",
          user_id: receiverProfile.user_uuid,
          data: {
            requested_by: receiverProfile.data.full_name,
            requested_to: senderProfile.data.full_name,
            type: locoAction["opResult"]["type"],
            notification_type: "banker_has_accepted_the_video_consultation",
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
          // contact_infos: adminContacts,
        });
      }
    }
  }

  return context;
}

async function beforeHandlePatchVideoConsultation(context) {
  const { locoAction } = context;

  const payload = locoAction.payload;

  if (locoAction.action === "patch" && payload.uuid) {
    const videoConsultationRequest = await VideoConsultation.findByPk(
      payload.uuid
    );

    if (!videoConsultationRequest) {
      throw {
        statusCode: 500,
        message: "Request not found",
      };
    }

    if (videoConsultationRequest.module === "gm_module") {
      if (
        (payload.destination_accepted_on || payload.destination_rejected_on) &&
        videoConsultationRequest.request_status !== "source_send_request"
      ) {
        if (
          videoConsultationRequest.request_status ===
          "destination_accepted_the_request"
        ) {
          throw {
            statusCode: 500,
            message: "Already Request Accepted",
          };
        }

        if (
          videoConsultationRequest.request_status ===
          "destination_rejected_the_request"
        ) {
          throw {
            statusCode: 500,
            message: "Already Request Rejected",
          };
        }

        throw {
          statusCode: 500,
          message: "Request Expired",
        };
      }
    }
  }

  return context;
}

async function beforeHandleCreateVideoConsultation(context) {
  const { locoAction } = context;

  const payload = locoAction.payload;

  if (locoAction.action === "create") {
    if (payload.module === "gm_module") {
      const found = await VideoConsultation.findAll({
        where: {
          source: payload.source,
          destination: payload.destination,
          createdAt: {
            [Op.gt]: moment()
              .subtract(3, "minutes")
              .format("YYYY-MM-DD HH:mm:ss"),
          },
        },
      });

      if (found.length > 0) {
        throw {
          statusCode: 500,
          message: "There is active request present",
        };
      }
    }
  }

  return context;
}

module.exports = {
  afterRespondCreateVideoConsultation,
  afterRespondPatchVideoConsultation,
  beforeHandlePatchVideoConsultation,
  beforeHandleCreateVideoConsultation,
};
