const sendPushNotification = require("../../functions/neptune/neptuneCaller");
const Profile = require("../../models").Profile;
const adminContacts = require("../../static/adminContacts");

async function afterRespondCreateVideoConsultation(context) {
  const { locoAction } = context;

  // this notification will be triggered when buyer raises request for both future date and live consultations.

  let senderProfile = await Profile.findOne({
    where: {
      uuid: locoAction["payload"]["buyer_uuid"],
      type: "fm-buyer",
    },
  });

  let receiverProfile = await Profile.findOne({
    where: {
      uuid: locoAction["payload"]["banker_uuid"],
      type: "fm-seller",
    },
  });

  await sendPushNotification({
    event_type: "buyer_has_requested_video_consultation",
    user_id: receiverProfile.user_uuid,
    data: {
      requested_by: senderProfile.data.full_name,
      requested_to: receiverProfile.data.full_name,
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
  return context;
}

async function afterRespondPatchVideoConsultation(context) {
  const { locoAction } = context;

  let receiverProfile = await Profile.findOne({
    where: {
      uuid: locoAction["opResult"]["buyer_uuid"],
      type: "fm-buyer",
    },
  });
  let senderProfile = await Profile.findOne({
    where: {
      uuid: locoAction["opResult"]["banker_uuid"],
      type: "fm-seller",
    },
  });

  // this notification will be triggered both when buyer has done the payment for both future date consultations and live consultation.

  if (locoAction["opResult"]["request_status"] === "buyer_payment_done") {
    await sendPushNotification({
      event_type: "buyer_has_paid_for_the_consultation",
      user_id: senderProfile.user_uuid,
      data: {
        requested_by: receiverProfile.data.full_name,
        requested_to: senderProfile.data.full_name,
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
    locoAction["opResult"]["request_status"] === "banker_rejected_the_request"
  ) {
    // this notification will be triggered both when banker rejects the buyers consulation request  for both future date consultations and live consultation.

    console.log("we are in push notification for the rejected status");
    await sendPushNotification({
      event_type: "banker_rejected_the_video_consultation",
      user_id: receiverProfile.user_uuid,
      data: {
        requested_by: receiverProfile.data.full_name,
        requested_to: senderProfile.data.full_name,
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
    locoAction["opResult"]["request_status"] === "banker_accepted_the_request"
  ) {
    // this notification will be triggered both when banker accepts the buyers consulation request  for both future date consultations and live consultation.

    console.log("we are in push notification for the accepted status");
    await sendPushNotification({
      event_type: "Buyer_has_accepted_the_video_consultation_request",
      user_id: receiverProfile.user_uuid,
      data: {
        requested_by: receiverProfile.data.full_name,
        requested_to: senderProfile.data.full_name,
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
  return context;
}

module.exports = {
  afterRespondCreateVideoConsultation,
  afterRespondPatchVideoConsultation,
};
