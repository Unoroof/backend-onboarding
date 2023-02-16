const callNeptune = require("../functions/neptune/neptuneCaller");
const adminContacts = require("../static/adminContacts");

module.exports = async (status, queryResponse) => {
  try {
    if (status === "responded") {
      if (queryResponse.query_type === "refinance_existing_loan") {
        await callNeptune({
          event_type: "seller_sent_quote_to_a_financing_query",
          user_id: queryResponse.data.seller_detail.user_uuid,
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type: "seller_sent_quote_to_a_financing_query",
          },
        });
        await callNeptune({
          event_type: "buyer_received_quote_to_a_financing_query",
          user_id: queryResponse.data.buyer_detail.user_uuid,
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type: "buyer_received_quote_to_a_financing_query",
          },
          ignore_user_contacts: false,
          contact_infos: adminContacts,
        });
      } else {
        await callNeptune({
          event_type: "seller_sent_quote_to_a_non_financing_query",
          user_id: queryResponse.data.seller_detail.user_uuid,
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "non-financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type: "seller_sent_quote_to_a_non_financing_query",
          },
        });

        await callNeptune({
          event_type: "buyer_received_quote_to_a_non_financing_query",
          user_id: queryResponse.data.buyer_detail.user_uuid,
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "non-financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type: "buyer_received_quote_to_a_non_financing_query",
          },
          ignore_user_contacts: false,
          contact_infos: adminContacts,
        });
      }
    } else if (status === "approved") {
      if (queryResponse.query_type === "refinance_existing_loan") {
        await callNeptune({
          event_type: "buyer_accepted_a_financing_query",
          user_id: queryResponse.data.buyer_detail.user_uuid, // user id of person whome to send pushnotification
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            status: "accepted",
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type: "buyer_accepted_a_financing_query", //query detail page
          },
        });
        await callNeptune({
          event_type: "seller_received_accepted_response_to_a_financing_query",
          user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send pushnotification
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            status: "accepted",
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type:
              "seller_received_accepted_response_to_a_financing_query", //query detail page
          },
          ignore_user_contacts: false,
          contact_infos: adminContacts,
        });
      }
    } else if (status === "rejected") {
      if (queryResponse.query_type === "refinance_existing_loan") {
        await callNeptune({
          event_type: "buyer_rejected_a_financing_query",
          user_id: queryResponse.data.buyer_detail.user_uuid, // user id of person whome to send pushnotification
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            status: "rejected",
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type: "buyer_rejected_a_financing_query", //query detail page
          },
        });
        await callNeptune({
          event_type: "seller_received_rejected_response_to_a_financing_query",
          user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send pushnotification
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            status: "rejected",
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type:
              "seller_received_rejected_response_to_a_financing_query", //query detail page
          },
        });
      }
    } else if (status === "requote_request") {
      if (queryResponse.query_type === "refinance_existing_loan") {
        await callNeptune({
          event_type: "buyer_requested_to_requote_a_financing_query",
          user_id: queryResponse.data.buyer_detail.user_uuid, // user id of person whome to send pushnotification
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type: "buyer_requested_to_requote_a_financing_query", //query detail page
          },
        });
        await callNeptune({
          event_type: "seller_received_requote_request_to_a_financing_query",
          user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send pushnotification
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type:
              "seller_received_requote_request_to_a_financing_query", //query detail page
          },
          ignore_user_contacts: false,
          contact_infos: adminContacts,
        });
      }
    } else if (status === "requote_request_responded") {
      if (queryResponse.query_type === "refinance_existing_loan") {
        await callNeptune({
          event_type: "seller_sent_requote_to_a_financing_query",
          user_id: queryResponse.data.seller_detail.user_uuid, // user id of person whome to send pushnotification
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type: "seller_sent_requote_to_a_financing_query", //query detail page
          },
        });
        await callNeptune({
          event_type: "buyer_received_requote_to_a_financing_query",
          user_id: queryResponse.data.buyer_detail.user_uuid, // user id of person whome to send pushnotification
          data: {
            name: queryResponse.data.seller_detail.full_name,
            query_type: "financing",
            query_uuid: queryResponse.query_uuid,
            query_response_uuid: queryResponse.uuid,
            ...queryResponse.data,
            notification_type: "buyer_received_requote_to_a_financing_query", //query detail page
          },
        });
      }
    }
  } catch (error) {
    console.log("check here", error);
  }
};
