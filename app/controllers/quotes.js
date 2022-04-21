const models = require("../models");
const Quotes = models.Quotes;
const Profile = models.Profile;
const QuoteResponse = models.QuoteResponse;
const consumeError = require("../functions/consumeError");
const sequelize = require("../models").sequelize;

module.exports = {
  async index(req) {
    try {
      console.log("req======", req);
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

        let constraints = {
          where: {
            profile_uuid: profile.uuid,
          },
        };

        if (req.query.status) constraints.where.status = req.query.status;
        let quotes = await Quotes.findAll(
          {
            limit: req.query.limit || 100,
            ...constraints,
            order: [["createdAt", "DESC"]],
          },
          { transaction: t }
        );
        return quotes;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },

  async create(req) {
    try {
      const result = await sequelize.transaction(async (t) => {
        let profile = await Profile.findOne(
          {
            where: {
              user_uuid: req.user,
              type: "fm-buyer",
            },
          },
          { transaction: t }
        );

        const quote = await Quotes.create(
          {
            profile_uuid: profile.uuid,
            seller_uuid: req.body.seller_uuid,
            data: req.body.data,
            status: "open",
          },
          { transaction: t }
        );

        if (!quote) {
          throw new Error("Unable to create quote");
        }

        await QuoteResponse.create(
          {
            buyer_uuid: quote.profile_uuid,
            quote_uuid: quote.uuid,
            seller_uuid: quote.seller_uuid,
            status: "pending",
            data: quote.data,
          },
          { transaction: t }
        );

        return quote;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req) {
    try {
      const result = await sequelize.transaction(async (t) => {
        let quote = await Quotes.findOne(
          {
            where: {
              uuid: req.params.quote_uuid,
            },
          },
          { transaction: t }
        );

        if (!quote) {
          throw new Error("Quote is not found.");
        }

        quote = await quote.update(
          {
            data: req.body.data
              ? { ...quote.data, ...req.body.data }
              : quote.data,
            status: req.body.status,
          },
          { transaction: t }
        );

        return quote;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },
};
