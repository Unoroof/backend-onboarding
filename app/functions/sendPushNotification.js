const callNeptune = require("./neptune/neptuneCaller");

module.exports = async (data) => {
  try {
    console.log("check", data);

    await callNeptune({
      event_type: "user_have_assigned_a_query",
      user_id: "12345", // user id of person whome to send query
      data: {
        name: "Rajesh", // enquiry.data.name,
        company_name: "Betalectic", // enquiry.data.company_name
        query_type: "financing",
        product_type: "Acquisition Financing",
        loan_amount: "100000000",
        notification_type: "user_have_assigned_a_query", //query detail page
      },
    });
  } catch (error) {
    console.log("check here", error);
  }
};
