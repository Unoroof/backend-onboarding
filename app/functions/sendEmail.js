const sendEvent = require("./neptune/neptuneCaller");

module.exports = async (enquiry) => {
  try {
    console.log("check", enquiry);
    if (enquiry.type === "for_partner") {
      await sendEvent({
        event_type: "user_raised_partner_enquiry",
        user_id: enquiry.user_uuid,
        data: {
          name: "Rajesh", // enquiry.data.name,
          company_name: "Betalectic", // enquiry.data.company_name,
        },
        ignore_user_contacts: true,
        contact_infos: [
          {
            type: "email",
            value: "sonali@unoroof.in",
          },
          {
            type: "email",
            value: "manasa@betalectic.com",
            cc: true,
          },
          {
            type: "email",
            value: "rajesh@betalectic.com",
            cc: true,
          },
        ],
      });
    } else if (enquiry.type === "for_product") {
      await sendEvent({
        event_type: "user_raised_product_enquiry",
        user_id: enquiry.user_uuid,
        data: {
          name: "Rajesh", // enquiry.data.name,
          company_name: "Betalectic", // enquiry.data.company_name,
        },
        ignore_user_contacts: true,
        contact_infos: [
          {
            type: "email",
            value: "sonali@unoroof.in",
          },
          {
            type: "email",
            value: "manasa@betalectic.com",
            cc: true,
          },
          {
            type: "email",
            value: "rajesh@betalectic.com",
            cc: true,
          },
        ],
      });
    } else if (enquiry.type === "for_credit_profile") {
      await sendEvent({
        event_type: "user_raised_credit_enquiry",
        user_id: enquiry.user_uuid,
        data: {
          name: "Rajesh", // enquiry.data.name,
          company_name: "Betalectic", // enquiry.data.company_name,
          buyer_name: "Shubham",
        },
        ignore_user_contacts: true,
        contact_infos: [
          {
            type: "email",
            value: "sonali@unoroof.in",
          },
          {
            type: "email",
            value: "manasa@betalectic.com",
            cc: true,
          },
          {
            type: "email",
            value: "rajesh@betalectic.com",
            cc: true,
          },
        ],
      });
    }
  } catch (error) {
    console.log("check here", error);
  }
};
