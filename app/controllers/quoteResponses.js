const models = require("../models");
const QuoteResponse = models.QuoteResponse;
const consumeError = require("../functions/consumeError");
const sequelize = require("../models").sequelize;

module.exports = {
  async index(req) {
    try {
      let constraints = {
        where: {},
      };

      if (req.query.uuid) constraints.where.uuid = req.query.uuid;
      if (req.query.buyer_uuid)
        constraints.where.buyer_uuid = req.query.buyer_uuid;
      if (req.query.query_uuid)
        constraints.where.query_uuid = req.query.query_uuid;
      if (req.query.seller_uuid)
        constraints.where.seller_uuid = req.query.seller_uuid;
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

  async update(req, res) {
    try {
      console.log("check here response_uuid", req.params.response_uuid);

      let result = sequelize.transaction(async (t) => {
        let quoteResponse = await QuoteResponse.findOne(
          {
            where: {
              uuid: req.params.response_uuid,
            },
          },
          { transaction: t }
        );

        let payload = {
          buyer_uuid: quoteResponse.buyer_uuid,
          quote_uuid: quoteResponse.quote_uuid,
          seller_uuid: quoteResponse.seller_uuid,
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
