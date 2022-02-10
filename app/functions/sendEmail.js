const sendEmailToAdmin = require("./neptune/neptuneCaller");

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
          // these values we have to pass in data
          // "name": "rajesh",
          // "currency": "INR",
          // "domestic": "yes",
          // "exporter": "Yes",
          // "importer": "No",
          // "lc_limit": "Yes",
          // "supplier": "Yes",
          // "turnover": "25-100",
          // "borrowing": "",
          // "cin_number": "1234567890",
          // "sblc_limit": "Yes",
          // "description": "help asap",
          // "loan_amount": "100000000",
          // "company_name": "betalectic",
          // "buyer_segment": "",
          // "credit_amount": "1000000",
          // "borrowing_cost": "10",
          // "current_amount": "20000000",
          // "credit_currency": "USD",
          // "current_currency": "INR",
          // "max_interest_rate": "70%",
          // "credit_rating_long": "10",
          // "credit_funded_limit": "20",
          // "credit_rating_short": "8",
          // "current_funded_limit": "30",
          // "current_product_used": "Buyer credit",
          // "credit_non_funded_limit": "80",
          // "current_non_funded_limit": "70",
          // "current_financial_partner": "HDFC",
          // "supplier_bill_discounting": "No"
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
      await sendEmailToAdmin({
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
      await sendEmailToAdmin({
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
