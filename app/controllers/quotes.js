const models = require("../models");
const Quotes = models.Quotes;
const Profile = models.Profile;
const Address = models.Address;
const GmProduct = models.GmProduct;
const QuoteResponse = models.QuoteResponse;
const GmCategory = models.GmCategory;
const consumeError = require("../functions/consumeError");
const sequelize = require("../models").sequelize;
const { Op } = require("sequelize");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");

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
            if (req.body.type === "best_bids_quote") {
              await QuoteResponse.create(
                {
                  buyer_uuid: quote.profile_uuid,
                  quote_uuid: quote.uuid,
                  quote_type: quote.type,
                  status: "pending",
                  data: quote.data,
                  owner_uuid: quote.data.seller_uuid,
                },
                { transaction: t }
              );
            }
            if (req.body.type === "customized_quote") {
              const eligibleResponders = await getEligibleResponders(
                req.token,
                quote.data.sellers
              );

              console.log(
                "QuotesEligibleResponders",
                JSON.stringify(eligibleResponders)
              );
              eligibleResponders.wired_up_users.forEach(
                async (sellersProfileUuid) => {
                  console.log("sellersProfileUuid", sellersProfileUuid);
                  let quoteResponse = await QuoteResponse.create({
                    buyer_uuid: quote.profile_uuid, // quote creator
                    quote_uuid: quote.uuid,
                    status: "pending",
                    data: quote.data,
                    owner_uuid: sellersProfileUuid,
                    quote_type: quote.type,
                  });
                  console.log("quoteResponse", JSON.stringify(quoteResponse));
                }
              );
            }
          } else {
            throw new Error("Please add the address details");
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
            throw new Error("Address details already exists");
          }

          await Address.create({
            profile_uuid: profile.uuid,
            location_name: req.body.data.location_name,
            address: req.body.data.address,
            country: req.body.data.country,
            city: req.body.data.city,
            pincode: req.body.data.pincode,
          });

          if (req.body.type === "best_bids_quote") {
            await QuoteResponse.create(
              {
                buyer_uuid: quote.profile_uuid,
                quote_uuid: quote.uuid,
                quote_type: quote.type,
                status: "pending",
                data: quote.data,
                owner_uuid: quote.data.seller_uuid,
              },
              { transaction: t }
            );
          }
          if (req.body.type === "customized_quote") {
            const eligibleResponders = await getEligibleResponders(
              req.token,
              quote.data.sellers
            );
            console.log(
              "QuotesEligibleResponders",
              JSON.stringify(eligibleResponders)
            );
            eligibleResponders.wired_up_users.forEach(
              async (sellersProfileUuid) => {
                let quoteResponse = await QuoteResponse.create({
                  buyer_uuid: quote.profile_uuid, // quote creator
                  quote_uuid: quote.uuid,
                  status: "pending",
                  data: quote.data,
                  owner_uuid: sellersProfileUuid,
                  quote_type: quote.type,
                });
                console.log("quoteResponse", JSON.stringify(quoteResponse));
              }
            );
          }
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

const getEligibleResponders = async (token, sellers) => {
  try {
    let eligibleResponders = {};
    let wired_up_users = [];

    if (sellers.buyer_selected_sellers) {
      sellers.buyer_selected_sellers.forEach((item) => {
        // in buyer_selected_sellers we have profile_uuid's so we can push to eligibleResponders[wired_up_users]
        wired_up_users.push(item.value);
      });
    }

    if (sellers.system_selected_sellers) {
      if (
        typeof sellers.system_selected_sellers === "object" &&
        Object.keys(sellers.system_selected_sellers).length > 0
      ) {
        let sellerProfiles = await findSystemSelectedSellers(
          sellers.system_selected_sellers
        );
        console.log("check here system selected seller", sellerProfiles);
        sellerProfiles.forEach((item) => {
          wired_up_users.push(item.uuid);
        });
      }
    }

    if (sellers.addressbook_contacts) {
      let addressbookSellers = await findAddressbookSellers(
        token,
        sellers.addressbook_contacts
      );
      console.log("check here addressbook", addressbookSellers);
      addressbookSellers.forEach((item) => {
        wired_up_users.push(item);
      });
    }

    eligibleResponders["wired_up_users"] = wired_up_users;

    return eligibleResponders;
  } catch (error) {
    consumeError(error);
  }
};

const findSystemSelectedSellers = async (condition) => {
  try {
    let where = {
      name: {
        [Op.iLike]: `%${condition.product_name}%`,
      },
      "data.additional_product_info.min_order_quantity": {
        [Op.lte]: condition.quantity,
      },
    };

    let constraints = {
      where: where,
      include: {
        model: GmCategory,
        as: "gmCategories",
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        where: {
          uuid: condition.category,
        },
        through: {
          as: "gm_products_categories",
        },
      },
    };

    console.log("chck here constraints", constraints);

    let profiles = await GmProduct.findAll(constraints);
    console.log("check here profiles", profiles);
    return profiles;
  } catch (error) {
    consumeError(error);
  }
};

const findAddressbookSellers = async (token, contacts) => {
  try {
    let userProfiles = [];
    await Promise.all(
      await contacts.map(async (item) => {
        let payload = {
          email: item.email,
          mobile: item.mobile,
        };
        console.log("payload of addressbook finding", payload);
        await findUserByEmailMobile(token, payload)
          .then(async (res) => {
            console.log("response------>", res);
            if (res.user_uuid) {
              let sellerProfile = await Profile.findOne({
                where: {
                  user_uuid: res.user_uuid,
                  type: "fm-buyer",
                },
              });
              if (sellerProfile) {
                userProfiles.push(sellerProfile.uuid);
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });
        console.log("check here userProfiles", userProfiles);
        return userProfiles;
      })
    );
    console.log("check here userProfiles3", userProfiles);
    return userProfiles;
  } catch (error) {
    consumeError(error);
  }
};
