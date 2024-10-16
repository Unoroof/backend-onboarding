const consumeError = require("../functions/consumeError");
const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const Profile = require("../models").Profile;
const { Op, Sequelize } = require("sequelize");
const getSearchQueries = require("../functions/getSearchQueries");
const getGmProducts = require("../functions/getGmProducts");
const getCompanyProducts = require("../functions/getCompanyProducts");
const sendPushNotification = require("../functions/neptune/neptuneCaller");
const sequelize = require("../models").sequelize;
const adminContacts = require("../static/adminContacts");

module.exports = {
  async index(req, res) {
    try {
      let whereClouse = {};

      if (req.query.profile_uuid) {
        whereClouse = {
          profile_uuid: req.query.profile_uuid,
        };
      }

      if (req.query.status) {
        whereClouse["status"] = req.query.status;
      }

      if (req.query.product_uuid) {
        whereClouse["uuid"] = req.query.product_uuid;
      }

      const gmCategories = req.query.gm_categories
        ? req.query.gm_categories.split(",").filter((category) => category)
        : [];

      const gmCategoryUuidOptions =
        gmCategories.length !== 0
          ? {
              model: GmCategory,
              as: "gmCategories",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              where: {
                uuid: {
                  [Op.in]: gmCategories,
                },
              },
              through: {
                as: "gm_products_categories",
              },
            }
          : {
              model: GmCategory,
              as: "gmCategories",
              attributes: {
                exclude: ["createdAt", "updatedAt", "deletedAt"],
              },
            };

      let gmProducts = await GmProduct.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: gmCategoryUuidOptions,
        ...getSearchQueries(req.query.search),
        where: whereClouse,
      });

      return gmProducts;
    } catch (error) {
      consumeError(error);
    }
  },

  async store(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      let profileUuids = await sequelize.query(
        `select distinct profile_uuid  from gm_products where ((data->>'category')::jsonb)->>'value'='${req.body.categories}'AND profile_uuid !='${profile.uuid}'`
      );

      profileUuids[0].map(async (item, index) => {
        let receiverProfile = await Profile.findOne({
          where: {
            uuid: item.profile_uuid,
            type: "fm-buyer",
          },
        });
        await sendPushNotification({
          event_type: "new_product_added_in_category",
          user_id: receiverProfile.user_uuid,
          data: {
            creator_name: profile.data.full_name,
            product_name: req.body.data.product_name,
            category_name: req.body.data.category.label,
            receiver_name: receiverProfile.data.full_name,
            notification_type: "buyer_has_added_new_product",
            category_uuid: req.body.data.category.value,
            profile_uuid: profile.uuid,
          },
          ignore_user_contacts: false,
          // contact_infos: adminContacts,
        });
      });

      if (profile) {
        let payload = {
          name: req.body.name,
          profile_uuid: profile.uuid,
          brand_name: req.body.brand_name,
          price: req.body.price,
          discount: req.body.discount,
          data: req.body.data,
        };
        if (req.body.max_price) {
          payload["max_price"] = req.body.max_price;
        }

        if (req.body.status) {
          payload["status"] = req.body.status;
        }

        const gmProduct = await GmProduct.create(payload);

        const productCategories =
          req.body.categories.length !== 0
            ? await GmCategory.findAll({
                where: {
                  uuid: {
                    [Op.or]: req.body.categories,
                  },
                },
                attributes: ["uuid", "name"],
              })
            : [];

        gmProduct.setGmCategories(productCategories);
        gmProduct.categories = productCategories;
        return gmProduct;
      } else {
        throw new Error("To add product user has to be onboarded!");
      }
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let payload = {};
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });
      let gmProduct = await GmProduct.findOne({
        where: {
          uuid: req.params.gm_product_uuid,
        },
      });

      let profileUuids = await sequelize.query(
        `select distinct profile_uuid  from gm_products where ((data->>'category')::jsonb)->>'value'='${req.body.categories}'AND profile_uuid !='${profile.uuid}'`
      );
      console;
      if (req.body.name) {
        payload["name"] = req.body.name;
      }

      if (req.body.brand_name) {
        payload["brand_name"] = req.body.brand_name;
      }

      if (req.body.price) {
        payload["price"] = { ...gmProduct.price, ...req.body.price };
      }

      if (req.body.discount) {
        payload["discount"] = req.body.discount;
      }

      if (req.body.data) {
        payload["data"] = { ...gmProduct.data, ...req.body.data };
      }

      if (req.body.status) {
        payload["status"] = req.body.status;
      }

      if (req.body.max_price) {
        payload["max_price"] = {
          ...gmProduct.max_price,
          ...req.body.max_price,
        };
      }

      gmProduct = await gmProduct.update(payload);

      profileUuids[0].map(async (item, index) => {
        let receiverProfile = await Profile.findOne({
          where: {
            uuid: item.profile_uuid,
            type: "fm-buyer",
          },
        });
        await sendPushNotification({
          event_type: "gm_product_details_updated_in_category",
          user_id: receiverProfile.user_uuid,
          data: {
            creator_name: profile.data.full_name,
            product_name: req.body.data.product_name,
            category_name: req.body.data.category.label,
            receiver_name: receiverProfile.data.full_name,
            notification_type: "user_has_updated_the_product_details",
            category_uuid: req.body.data.category.value,
            profile_uuid: profile.uuid,
          },
          ignore_user_contacts: false,
          // contact_infos: adminContacts,
        });
      });
      return gmProduct;
    } catch (error) {
      console.error(error);
    }
  },

  async getProductById(req, res) {
    try {
      let gmProduct = await GmProduct.findOne({
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT "profiles"."data"
                FROM "profiles"
                WHERE "profiles"."uuid" = "GmProduct"."profile_uuid"
                )`),
              "profile_data",
            ],
          ],
          exclude: ["createdAt", "updatedAt"],
        },
        include: {
          model: GmCategory,
          as: "gmCategories",
          attributes: {
            exclude: ["createdAt", "updatedAt", "deletedAt"],
          },
        },
        where: {
          uuid: req.params.gm_product_uuid,
        },
        raw: true,
      });
      return gmProduct;
    } catch (error) {
      consumeError(error);
    }
  },

  async getBrandNamesForProduct(req, res) {
    try {
      let gmProducts = await GmProduct.findAll({
        attributes: [
          [Sequelize.fn("DISTINCT", Sequelize.col("brand_name")), "brand_name"],
        ],
        where: {
          name: {
            [Op.iLike]: {
              [Op.any]: req.body.products,
            },
          },
        },
        distinct: true,
      });

      return gmProducts;
    } catch (error) {
      consumeError(error);
    }
  },

  async getFilteredProducts(req, res) {
    try {
      let where = {};
      // if (req.body.product_names) {
      //   where["name"] = { [Op.in]: req.body.product_names };
      // }

      if (req.body.brand_names) {
        where["brand_name"] = { [Op.in]: req.body.brand_names };
      }

      if (req.body.country_of_origin === "Domestic") {
        where["data.country_of_origin.label"] = "India";
      }

      if (req.body.country_of_origin === "International") {
        where[Op.not] = { "data.country_of_origin.label": "India" };
      }

      if (req.body.country) {
        if (req.body.country === "India") {
          if (req.body.cities) {
            where[Op.and] = [
              { "data.logistics.india.delivery": true },
              {
                "data.logistics.india.exceptions": {
                  [Op.and]: req.body.cities.map((e) => {
                    return { [Op.notLike]: `%${e}%` };
                  }),
                },
              },
            ];
          } else {
            where["data.logistics.india"] = { delivery: true };
          }
        } else {
          where[Op.and] = [
            { "data.logistics.international.delivery": true },
            {
              "data.logistics.international.exceptions": {
                [Op.and]: [req.body.country].map((e) => {
                  return { [Op.notLike]: `%${e}%` };
                }),
              },
            },
          ];
        }
      }

      let gmProducts = await GmProduct.findAll({
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT "profiles"."data" 
                FROM "profiles"
                WHERE "profiles"."uuid" = "GmProduct"."profile_uuid"
                )`),
              "profile_data",
            ],
          ],
          exclude: ["createdAt", "updatedAt"],
        },
        include: req.body.category
          ? {
              model: GmCategory,
              as: "gmCategories",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              where: {
                uuid: req.body.category,
              },
              through: {
                as: "gm_products_categories",
              },
            }
          : {
              model: GmCategory,
              as: "gmCategories",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },

              through: {
                as: "gm_products_categories",
              },
            },
        where: where,
      });

      gmProducts = JSON.parse(JSON.stringify(gmProducts));
      return gmProducts;
    } catch (error) {
      consumeError(error);
    }
  },

  async getSearchProducts(req, res) {
    try {
      let products = [];
      if (req.query.keyword) {
        products = await getGmProducts(
          {
            name: { [Op.iLike]: `%${req.query.keyword}%` },
          },
          "product"
        );

        let companyProducts = await getCompanyProducts({
          "data.company_name": { [Op.iLike]: `%${req.query.keyword}%` },
        });

        let brandProducts = await getGmProducts(
          {
            brand_name: { [Op.iLike]: `%${req.query.keyword}%` },
          },
          "brand"
        );

        products = [...products, ...companyProducts, ...brandProducts];
      }

      return products;
    } catch (error) {
      consumeError(error);
    }
  },
};
