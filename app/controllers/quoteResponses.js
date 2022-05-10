const models = require("../models");
const QuoteResponse = models.QuoteResponse;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");
const sequelize = require("../models").sequelize;
const getPagination = require("../functions/getPagination");
const getPagingData = require("../functions/getPagingData");

module.exports = {
  async index(req) {
    try {
      let constraints = {
        where: {},
      };

      if (req.query.uuid) constraints.where.uuid = req.query.uuid;
      if (req.query.buyer_uuid)
        constraints.where.buyer_uuid = req.query.buyer_uuid;
      if (req.query.quote_uuid)
        constraints.where.quote_uuid = req.query.quote_uuid;

      if (req.query.status) constraints.where.status = req.query.status;

      let result = sequelize.transaction(async (t) => {
        let quoteResponses = await QuoteResponse.findAll(constraints, {
          transaction: t,
        });
        return quoteResponses;
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
