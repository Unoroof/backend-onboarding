const models = require("../models");
const Quotes = models.Quotes;
const Profile = models.Profile;
const Address = models.Address;
const QuoteResponse = models.QuoteResponse;
const consumeError = require("../functions/consumeError");
const sequelize = require("../models").sequelize;

module.exports = {
  async index(req) {
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

        if (req.body.type === "best_bids_quote") {
          if (req.body.data.seller_uuid) {
            let profile = await Profile.findOne(
              {
                where: {
                  uuid: req.body.data.seller_uuid,
                  type: "fm-buyer",
                },
              },
              { transaction: t }
            );
            if (!profile) {
              throw new Error("Seller not found");
            }
          } else {
            throw new Error("Please add the seller_uuid");
          }
        }

        if (req.body.type === "customized_quote") {
          if (!req.body.data.sellers) {
            throw new Error("Please add the sellers");
          }
        }

        const quote = await Quotes.create(
          {
            profile_uuid: profile.uuid,
            data: req.body.data,
            type: req.body.type,
            status: "open",
          },
          { transaction: t }
        );

        if (!quote) {
          throw new Error("Unable to create quote");
        }

        if (req.body.address_type === "existing_address") {
          let addressFound = await Address.findOne(
            {
              where: {
                profile_uuid: profile.uuid,
                location_name:
                  req.body.type === "customized_quote"
                    ? req.body.data.my_location.location_name
                    : req.body.data.location_name,
              },
            },
            { transaction: t }
          );
          if (addressFound) {
            await QuoteResponse.create(
              {
                buyer_uuid: quote.profile_uuid,
                quote_uuid: quote.uuid,
                quote_type: quote.type,
                status: "pending",
                data: quote.data,
              },
              { transaction: t }
            );
          } else {
            throw new Error("Please add the Location details");
          }
        } else {
          let isAlreadyExistedAddress = await Address.findOne(
            {
              where: {
                profile_uuid: profile.uuid,
                location_name:
                  req.body.type === "customized_quote"
                    ? req.body.data.my_location.location_name
                    : req.body.data.location_name,
              },
            },
            { transaction: t }
          );

          if (isAlreadyExistedAddress) {
            throw new Error("Location name should be unique");
          }

          await Address.create({
            profile_uuid: profile.uuid,
            location_name: req.body.data.location_name,
            address: req.body.data.address,
            country: req.body.data.country,
            city: req.body.data.city,
            pincode: req.body.data.pincode,
          });

          await QuoteResponse.create(
            {
              buyer_uuid: quote.profile_uuid,
              quote_uuid: quote.uuid,
              quote_type: quote.type,
              status: "pending",
              data: quote.data,
            },
            { transaction: t }
          );
        }

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
