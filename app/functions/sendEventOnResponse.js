const callNeptune = require("../functions/neptune/neptuneCaller");

module.exports = async (status, queryResponse) => {
  try {
    if (status === "responded") {
      //   await callNeptune({
      //     event_type: "user_sent_quote_to_a_query",
      //     user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send pushnotification
      //     data: {
      //       name: queryResponse.data.seller_detail.full_name,
      //       query_type:
      //         queryResponse.query_type === "refinance_existing_loan"
      //           ? "financing"
      //           : "non-financing",
      //       product_type: queryResponse.data.loan_type.label,
      //       loan_amount: queryResponse.data.outstanding_loan_amount,
      //       notification_type: "user_sent_quote_to_a_query", //query detail page
      //     },
      //   });
      await callNeptune({
        event_type: "user_received_quote_to_a_query",
        user_id: queryResponse.data.buyer_detail.user_uuid, // user id of person whome to send pushnotification
        data: {
          name: queryResponse.data.seller_detail.full_name,
          query_type:
            queryResponse.query_type === "refinance_existing_loan"
              ? "financing"
              : "non-financing",
          product_type: queryResponse.data.loan_type.label,
          loan_amount: queryResponse.data.outstanding_loan_amount,
          profile_type: "fm-buyer",
          notification_type: "user_received_quote_to_a_query", //query detail page
        },
      });
    } else if (status === "approved") {
      // await callNeptune({
      //     event_type: "user_accepted_a_query",
      //     user_id: queryResponse.data.buyer_detail.user_uuid, // user id of person whome to send pushnotification
      //     data: {
      //       name: queryResponse.data.buyer_detail.full_name,
      //       query_type:
      //         queryResponse.query_type === "refinance_existing_loan"
      //           ? "financing"
      //           : "non-financing",
      //       product_type: queryResponse.data.loan_type.label,
      //       loan_amount: queryResponse.data.outstanding_loan_amount,
      //       notification_type: "user_accepted_a_query", //query detail page
      //     },
      //   });
      await callNeptune({
        event_type: "user_recieved_accepted_response_to_a_query",
        user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send pushnotification
        data: {
          name: queryResponse.data.buyer_detail.full_name,
          query_type:
            queryResponse.query_type === "refinance_existing_loan"
              ? "financing"
              : "non-financing",
          product_type: queryResponse.data.loan_type.label,
          loan_amount: queryResponse.data.outstanding_loan_amount,
          notification_type: "user_recieved_accepted_response_to_a_query", //query detail page
        },
      });
    } else if (status === "rejected") {
      //   await callNeptune({
      //     event_type: "user_rejected_a_query",
      //     user_id: queryResponse.data.buyerr_detail.user_uuid, // user id of person whome to send pushnotification
      //     data: {
      //       name: queryResponse.data.buyer_detail.full_name,
      //       query_type:
      //         queryResponse.query_type === "refinance_existing_loan"
      //           ? "financing"
      //           : "non-financing",
      //       product_type: queryResponse.data.loan_type.label,
      //       loan_amount: queryResponse.data.outstanding_loan_amount,
      //       notification_type: "user_rejected_a_query", //query detail page
      //     },
      //   });
      await callNeptune({
        event_type: "user_recieved_rejected_response_to_a_query",
        user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send pushnotification
        data: {
          name: queryResponse.data.buyer_detail.full_name,
          query_type:
            queryResponse.query_type === "refinance_existing_loan"
              ? "financing"
              : "non-financing",
          product_type: queryResponse.data.loan_type.label,
          loan_amount: queryResponse.data.outstanding_loan_amount,
          notification_type: "user_recieved_rejected_response_to_a_query", //query detail page
        },
      });
    } else if (status === "requote_request") {
      // await callNeptune({
      //     event_type: "user_requested_to_requote_a_query",
      //     user_id: queryResponse.data.buyer_detail.user_uuid, // user id of person whome to send pushnotification
      //     data: {
      //       name: queryResponse.data.buyer_detail.full_name,
      //       query_type:
      //         queryResponse.query_type === "refinance_existing_loan"
      //           ? "financing"
      //           : "non-financing",
      //       product_type: queryResponse.data.loan_type.label,
      //       loan_amount: queryResponse.data.outstanding_loan_amount,
      //       notification_type: "user_requested_to_requote_a_query", //query detail page
      //     },
      //   });
      await callNeptune({
        event_type: "user_received_requote_request_to_a_query",
        user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send pushnotification
        data: {
          name: queryResponse.data.buyer_detail.full_name,
          query_type:
            queryResponse.query_type === "refinance_existing_loan"
              ? "financing"
              : "non-financing",
          product_type: queryResponse.data.loan_type.label,
          loan_amount: queryResponse.data.outstanding_loan_amount,
          notification_type: "user_received_requote_request_to_a_query", //query detail page
        },
      });
    } else if (status === "requote_request_responded") {
      //   await callNeptune({
      //     event_type: "user_sent_requote_to_a_query",
      //     user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send pushnotification
      //     data: {
      //       name: queryResponse.data.buyer_detail.full_name,
      //       query_type:
      //         queryResponse.query_type === "refinance_existing_loan"
      //           ? "financing"
      //           : "non-financing",
      //       product_type: queryResponse.data.loan_type.label,
      //       loan_amount: queryResponse.data.outstanding_loan_amount,
      //       notification_type: "user_sent_requote_to_a_query", //query detail page
      //     },
      //   });
      await callNeptune({
        event_type: "user_received_requote_to_a_query",
        user_id: queryResponse.data.buyer_detail.user_uuid, // user id of person whome to send pushnotification
        data: {
          name: queryResponse.data.buyer_detail.full_name,
          query_type:
            queryResponse.query_type === "refinance_existing_loan"
              ? "financing"
              : "non-financing",
          product_type: queryResponse.data.loan_type.label,
          loan_amount: queryResponse.data.outstanding_loan_amount,
          notification_type: "user_received_requote_to_a_query", //query detail page
        },
      });
    }
  } catch (error) {
    console.log("check here", error);
  }
};
