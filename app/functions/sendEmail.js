const sendEmailToAdmin = require("./neptune/sendEmailToAdmin");

module.exports = async (enquiry) => {
  try {
    console.log("check", enquiry);
    if (enquiry.type === "for_partner") {
      await sendEmailToAdmin({
        event_type: "user_raised_partner_enquiry",
        user_id: enquiry.user_uuid,
        data: {
          name: "Rajesh", // enquiry.data.name,
          company_name: "Betalectic", // enquiry.data.company_name,
        },
      });
    } else if (enquiry.type === "for_product") {
      await sendEmailToAdmin({
        event_type: "user_raised_product_enquiry",
        user_id: enquiry.user_uuid,
        data: {
          name: "Rajesh", // enquiry.data.name,
          company_name: "Betalectic", // enquiry.data.company_name,
        },
      });
    } else if (enquiry.type === "for_credit_profile") {
      await sendEmailToAdmin({
        event_type: "user_raised_credit_enquiry",
        user_id: enquiry.user_uuid,
        data: {
          name: "Rajesh", // enquiry.data.name,
          company_name: "Betalectic", // enquiry.data.company_name,
          buyer_name: "Shubham",
        },
      });
    }
  } catch (error) {
    console.log("check here", error);
  }
};
