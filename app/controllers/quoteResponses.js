const models = require("../models");
const QuoteResponse = models.QuoteResponse;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");
const sequelize = require("../models").sequelize;
const { Op } = require("sequelize");
const getPagination = require("../functions/getPagination");
const getPagingData = require("../functions/getPagingData");

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

        quoteResponse = await quoteResponse.update(payload, { transaction: t });

        return quoteResponse;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },
};
