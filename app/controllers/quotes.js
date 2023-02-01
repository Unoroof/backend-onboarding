const models = require("../models");
const Quotes = models.Quotes;
const Profile = models.Profile;
const GmProduct = models.GmProduct;
const QuoteResponse = models.QuoteResponse;
const GmCategory = models.GmCategory;
const consumeError = require("../functions/consumeError");
const sequelize = require("../models").sequelize;
const { Op } = require("sequelize");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");
const getPagination = require("../functions/getPagination");
const getPagingData = require("../functions/getPagingData");
const sendPushNotification = require("../functions/neptune/neptuneCaller");
const sendEventOnResponse = require("../functions/sendEventOnResponse");
const filterSingleSellers = require("../functions/filterSingleSellers");
// const adminContacts = require("../static/adminContacts");

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

        const { page, size } = req.query;

        const { limit, offset } = getPagination(page - 1, size);

        let constraints = {
          where: {
            profile_uuid: profile.uuid,
          },
          limit,
          offset,
          order: [["createdAt", "DESC"]],
        };

        if (req.query.uuid) constraints.where.uuid = req.query.uuid;
        if (req.query.status) constraints.where.status = req.query.status;
        if (req.query.type) constraints.where.type = req.query.type;
        let quotes = await Quotes.findAndCountAll(constraints, {
          transaction: t,
        });
        const response = await getPagingData(quotes, page, limit);
        return response;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },

  async create(req) {
    try {
      //console.log("log in create quotes api", req.body.data.sellers); //this log
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


        // here we need to add the notification once the  buyer has created the  query.

        if (!quote) {
          throw new Error("Unable to create quote");
        }

        if (req.body.type === "best_bids_quote") {
          let constraints = {
            where: {
              name: {
                [Op.iLike]: `%${quote.data.product_name}%`,
              },
              profile_uuid: quote.data.seller_uuid,
              // "data.additional_product_info.min_order_quantity": {
              //   [Op.lte]: quote.data.quantity,
              // },
            },
          };


          let eligibleGlobalSellerGmProduct = await GmProduct.findOne(
            constraints,
            {
              transaction: t,
            }
          );

          if (eligibleGlobalSellerGmProduct) {
            let data = [quote.data].map(({ seller_uuid, ...rest }) => ({
              ...rest,
              seller_product_info: eligibleGlobalSellerGmProduct,
            }));
            let checkData = await QuoteResponse.create(
              {
                buyer_uuid: quote.profile_uuid,
                quote_uuid: quote.uuid,
                quote_type: quote.type,
                status: "buyer_raises_quote",
                data: data[0],
                owner_uuid: eligibleGlobalSellerGmProduct.profile_uuid,
              },
              { transaction: t }
            );

          } else {
            let data = [quote.data].map(({ seller_uuid, ...rest }) => ({
              ...rest,
              seller_product_info: null,
            }));
            await QuoteResponse.create(
              {
                buyer_uuid: quote.profile_uuid,
                quote_uuid: quote.uuid,
                quote_type: quote.type,
                status: "buyer_raises_quote",
                data: data[0],
                owner_uuid: null,
              },
              { transaction: t }
            );
          }
        }

        let eligibleResponders;
        if (req.body.type === "customized_quote") {
          eligibleResponders = await getEligibleResponders(
            req.token,
            quote.data.sellers
          );


          if (
            eligibleResponders &&
            eligibleResponders.wired_up_users &&
            eligibleResponders.wired_up_users.length > 0
          ) {
            eligibleResponders.wired_up_users.forEach(
              async ({ profile_uuid, seller_product_info }) => {
                let data = [quote.data].map(({ sellers, ...rest }) => ({
                  ...rest,
                  seller_product_info: seller_product_info,
                }));
                let quoteResponse = await QuoteResponse.create({
                  buyer_uuid: quote.profile_uuid, // quote creator
                  quote_uuid: quote.uuid,
                  status: "buyer_raises_quote",
                  data: data[0],
                  owner_uuid: profile_uuid,
                  quote_type: quote.type,
                });
              }
            );
          } else {
            let data = [quote.data].map(({ sellers, ...rest }) => ({
              ...rest,
              seller_product_info: null,
            }));
            let quoteResponse = await QuoteResponse.create({
              buyer_uuid: quote.profile_uuid, // quote creator
              quote_uuid: quote.uuid,
              status: "buyer_raises_quote",
              data: data[0],
              owner_uuid: null,
              quote_type: quote.type,
            });
          }
        }
        let sellerProfileData;
        if (quote.data.seller_uuid) {
          sellerProfileData = await Profile.findOne(
            {
              where: {
                uuid: quote.data.seller_uuid,
                type: "fm-buyer",
              },
            },
            { transaction: t }
          );
        }

        if (quote.type === "best_bids_quote" && quote.status === "open") {
          await sendPushNotification({
            event_type: "seller_received_quote_for_best_bid",
            user_id: sellerProfileData.user_uuid,
            data: {
              quote_type: "best_bid",
              buyer_company_name: profile?.dataValues?.data?.company_name
                ? profile.dataValues.data.company_name
                : "Buyer",
              notification_type: "seller_received_quote_for_best_bid",
            },
            // ignore_user_contacts: false,
            // contact_infos: adminContacts,
          });
        }

        if (quote.type === "customized_quote" && quote.status === "open") {
          eligibleResponders.wired_up_users.forEach(async (seller) => {
            const seller_profile_data = await Profile.findOne(
              {
                where: {
                  uuid: seller.profile_uuid,
                  type: "fm-buyer",
                },
              },
              { transaction: t }
            );
            await sendPushNotification({
              event_type: "seller_received_quote_for_best_bid",
              user_id: seller_profile_data.dataValues.user_uuid,
              data: {
                quote_type: "customised",
                buyer_company_name: profile?.dataValues?.data?.company_name
                  ? profile.dataValues.data.company_name
                  : "Buyer",
                notification_type: "seller_received_quote_for_best_bid",
              },
              // ignore_user_contacts: false,
              // contact_infos: adminContacts,
            });
          });
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
        wired_up_users.push({
          profile_uuid: item.value,
          seller_product_info: item.productInfo,
        });
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
        // console.log(
        //   "check here system selected seller",
        //   JSON.stringify(sellerProfiles)
        // );
        sellerProfiles.forEach((item) => {
          wired_up_users.push({
            profile_uuid: item.profile_uuid,
            seller_product_info: item,
          });
        });
      }
    }

    if (sellers.addressbook_contacts) {
      let addressbookSellers = await findAddressbookSellers(
        token,
        sellers.addressbook_contacts
      );
      addressbookSellers.forEach((item) => {
        wired_up_users.push({ profile_uuid: item, seller_product_info: null });
      });
    }

    if (sellers.system_selected_sellers.category) {
      wired_up_users = filterSingleSellers(wired_up_users, "profile_uuid");
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
      // name: {
      //   [Op.iLike]: `%${condition.product_name}%`,
      // },
      // "data.additional_product_info.min_order_quantity": {
      //   [Op.lte]: condition.quantity,
      // },
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


    let profiles = await GmProduct.findAll(constraints);
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
        await findUserByEmailMobile(token, payload)
          .then(async (res) => {
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
        return userProfiles;
      })
    );
    return userProfiles;
  } catch (error) {
    consumeError(error);
  }
};
