const models = require("../models");
const QuoteResponse = models.QuoteResponse;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");
const sequelize = require("../models").sequelize;
const { Op } = require("sequelize");
const getPagination = require("../functions/getPagination");
const getPagingData = require("../functions/getPagingData");
const sendPushNotification = require("../functions/neptune/neptuneCaller");
const sendEventOnResponse = require("../functions/sendEventOnResponse");
module.exports = {
  async index(req) {
    try {
      let result = sequelize.transaction(async (t) => {
        const { page, size } = req.query;
        const { limit, offset } = getPagination(page - 1, size);

        let profile = await Profile.findOne(
          {
            where: {
              user_uuid: req.user,
              type: "fm-buyer",
            },
          },
          { transaction: t }
        );

        let constraints = {
          where: {
            buyer_uuid: profile.uuid,
          },
          limit,
          offset,
          order: [["createdAt", "DESC"]],
        };

        const statuses = req.query.status
          ? req.query.status.split(",").filter((status) => status)
          : [];

        const buyer_payment_statuses = req.query.buyer_payment_status
          ? req.query.buyer_payment_status.split(",").filter((status) => status)
          : [];

        const seller_payment_statuses = req.query.seller_payment_status
          ? req.query.seller_payment_status
              .split(",")
              .filter((status) => status)
          : [];

        if (req.query.uuid) constraints.where.uuid = req.query.uuid;
        if (req.query.buyer_uuid)
          constraints.where.buyer_uuid = req.query.buyer_uuid;
        if (req.query.quote_uuid)
          constraints.where.quote_uuid = req.query.quote_uuid;
        if (req.query.quote_type)
          constraints.where.quote_type = req.query.quote_type;

        if (req.query.status) constraints.where.status = { [Op.in]: statuses };

        if (req.query.seller_payment_status)
          constraints.where.seller_payment_status = {
            [Op.in]: seller_payment_statuses,
          };

        if (req.query.buyer_payment_status)
          constraints.where.buyer_payment_status = {
            [Op.in]: buyer_payment_statuses,
          };

        let quoteResponses = await QuoteResponse.findAndCountAll(constraints, {
          transaction: t,
        });

        const response = await getPagingData(quoteResponses, page, limit);

        return response;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },

  async getBuyerQuotesToSeller(req) {
    try {
      let result = sequelize.transaction(async (t) => {
        let profile = await Profile.findOne(
          {
            where: {
              user_uuid: req.user,
              type: "fm-buyer",
            },
          },
          { transaction: t }
        );

        const { page, size } = req.query;

        const { limit, offset } = getPagination(page - 1, size);

        const constraints = {
          where: {
            owner_uuid: profile.uuid,
          },
          limit,
          offset,
          order: [["createdAt", "DESC"]],
        };

        const statuses = req.query.status
          ? req.query.status.split(",").filter((status) => status)
          : [];

        if (req.query.status) constraints.where.status = { [Op.in]: statuses };

        let quoteResponses = await QuoteResponse.findAndCountAll(constraints, {
          transaction: t,
        });
        const response = await getPagingData(quoteResponses, page, limit);
        return response;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let result = sequelize.transaction(async (t) => {
        let quoteResponse = await QuoteResponse.findOne(
          {
            where: {
              uuid: req.params.uuid,
            },
          },
          { transaction: t }
        );

        if (!quoteResponse) {
          throw new Error("Quote response not found");
        }

        let payload = {
          buyer_uuid: quoteResponse.buyer_uuid,
          quote_uuid: quoteResponse.quote_uuid,
        };

        if (req.body.status) {
          payload.status = req.body.status;
        }
        if (req.body.seller_payment_status) {
          payload.seller_payment_status = req.body.seller_payment_status;
        }
        if (req.body.buyer_payment_status) {
          payload.buyer_payment_status = req.body.buyer_payment_status;
        }
        if (req.body.data) {
          payload.data = req.body.data
            ? { ...quoteResponse.data, ...req.body.data }
            : quoteResponse.data;
        }
        if (req.body.status) {
          await sendEventOnResponse(req.body.status, quoteResponse);
        }

        quoteResponse = await quoteResponse.update(payload, { transaction: t });
        let buyerProfileData = await Profile.findOne(
          {
            where: {
              uuid: quoteResponse.buyer_uuid,
              type: "fm-buyer",
            },
          },
          { transaction: t }
        );
        // console.log("Buyer Profileeeeeeeeeeeeeeee", buyerProfileData);
        console.log("QUOTE RESPONSEEEEE$$$$$$$", quoteResponse);
        if (
          quoteResponse.quote_type === "best_bids_quote" &&
          quoteResponse.status === "seller_responded_to_quote"
        ) {
          await sendPushNotification({
            event_type: "buyer_received_quote_for_best_bid",
            user_id: buyerProfileData.user_uuid,
            data: {
              name: quoteResponse.data.product_name,
              quote_type: "best_bid",
              notification_type: "buyer_received_quote_for_best_bid",
            },
          });
        }
        if (
          quoteResponse.quote_type === "best_bids_quote" &&
          quoteResponse.status === "seller_ignored_the_quote"
        ) {
          await sendPushNotification({
            event_type: "seller_rejected_the_quote_for_best_bid",
            user_id: buyerProfileData.user_uuid,
            data: {
              query_type: "best_bid",
              notification_type: "seller_rejected_the_quote_for_best_bid",
            },
          });
        } else if (
          quoteResponse.quote_type === "customized_quote" &&
          quoteResponse.status === "seller_ignored_the_quote"
        ) {
          await sendPushNotification({
            event_type: "seller_rejected_the_customized_quote",
            user_id: buyerProfileData.user_uuid,
            data: {
              query_type: "customized",
              notification_type: "seller_rejected_the_customized_quote",
            },
          });
        }

        if (
          quoteResponse.quote_type === "best_bids_quote" &&
          quoteResponse.status === "buyer_accepted_the_quote" &&
          quoteResponse.data.seller_invoices &&
          quoteResponse.data.seller_invoices.length > 0
        ) {
          console.log(
            "USER UUID OF BUYER IN INVOICES CHECK",
            buyerProfileData.user_uuid
          );
          await sendPushNotification({
            event_type: "seller_added_invoices_for_best_bid",
            user_id: buyerProfileData.user_uuid,
            data: {
              name: quoteResponse.data.seller_product_info.name,
              quote_type: "best-bid",
              notification_type: "seller_added_invoices_for_best_bid",
            },
          });
        } else if (
          quoteResponse.quote_type === "customized_quote" &&
          quoteResponse.status === "buyer_accepted_the_quote" &&
          quoteResponse.data.seller_invoices.length > 0
        ) {
          await sendPushNotification({
            event_type: "seller_added_invoices_for_custom_quotes",
            user_id: buyerProfileData.user_uuid,
            data: {
              name: quoteResponse.data.seller_product_info.name,
              quote_type: "custom-quote",
              notification_type: "seller_added_invoices_for_custom_quotes",
            },
          });
        }

        if (
          quoteResponse.quote_type === "best_bids_quote" &&
          quoteResponse.status === "buyer_accepted_the_quote"
        ) {
          await sendPushNotification({
            event_type: "buyer_accepts_best_bid_quotation",
            user_id: buyerProfileData.user_uuid,
            data: {
              name: quoteResponse.data.seller_product_info.name,
              quote_type: "best-bid",
              notification_type: "buyer_accepts_best_bid_quotation",
            },
          });
        } else if (
          quoteResponse.quote_type === "best_bids_quote" &&
          quoteResponse.status === "buyer_rejected_the_quote"
        ) {
          await sendPushNotification({
            event_type: "buyer_rejects_best_bid_quotation",
            user_id: buyerProfileData.user_uuid,
            data: {
              name: quoteResponse.data.seller_product_info.name,
              quote_type: "best-bid",
              notification_type: "buyer_rejects_best_bid_quotation",
            },
          });
        }
        // if (
        //   quoteResponse.quote_type === "best_bids_quote" &&
        //   quoteResponse.status === "seller_ignored_the_quote"
        // ) {
        //   await sendPushNotification({
        //     event_type: "seller_ignored_the_quote_for_best_bid",
        //     user_id: quoteResponse.buyer_uuid,
        //     data: {
        //       name: quoteResponse.product_name,
        //       query_type: "rejected_bestbids_quote",
        //       quote_uuid: quoteResponse.quote_uuid,
        //       quote_response_uuid: quoteResponse.uuid,
        //       buyer_profile_uuid: quoteResponse.buyer_uuid,
        //       ...quoteResponse.data,
        //       notification_type: "seller_ignored_the_quote_for_best_bid",
        //     },
        //   });
        // }
        // else {
        //   await sendPushNotification({
        //     event_type: "seller_ignored_the_quote_for_best_bid",
        //     user_id: quoteResponse.buyer_uuid,
        //     data: {
        //       name: quoteResponse.product_name,
        //       quote_type: "rejected_customized_quote",
        //       quote_uuid: quoteResponse.quote_uuid,
        //       quote_response_uuid: quoteResponse.uuid,
        //       buyer_profile_uuid: quoteResponse.buyer_uuid,
        //       ...quoteResponse.data,
        //       notification_type: "seller_ignored_the_quote_for_best_bid",
        //     },
        //   });
        // }

        // if (
        //   quoteResponse.quote_type === "best_bids_quote" &&
        //   quoteResponse.status === "buyer_accepted_the_quote"
        // ) {
        //   await sendPushNotification({
        //     event_type: "buyer_accepts_best_bid_quote",
        //     user_id: quoteResponse.owner_uuid,
        //     data: {
        //       name: quoteResponse.product_name,
        //       quote_type: "accepted_best_bid_quote",
        //       notification_type: "buyer_accepts_best_bid_quote",
        //     },
        //   });
        // } else if (
        //   quoteResponse.quote_type === "best_bids_quote" &&
        //   quoteResponse.status === "buyer_rejected_the_quote"
        // ) {
        //   await sendPushNotification({
        //     event_type: "buyer_rejects_best_bid_quote",
        //     user_id: quoteResponse.owner_uuid,
        //     data: {
        //       name: quoteResponse.product_name,
        //       quote_type: "rejected_best_bid_quote",
        //       notification_type: "buyer_rejects_best_bid_quote",
        //     },
        //   });
        // }
        return quoteResponse;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },
};
