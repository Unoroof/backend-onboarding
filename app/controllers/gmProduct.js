const consumeError = require("../functions/consumeError");
const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const Profile = require("../models").Profile;
const { Op } = require("sequelize");
const getSearchQueries = require("../functions/getSearchQueries");

module.exports = {
  async index(req, res) {
    try {
      // let profile = await Profile.findOne({
      //   where: {
      //     user_uuid: req.user,
      //     type: "fm-buyer",
      //   },
      // });

      // if (profile) {
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
        ? req.query.categories.split(",").filter((category) => category)
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
      // } else {
      //   throw new Error("To view product user has to be onboarded!");
      // }
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
      if (!profile) {
        console.log("req.user", req.user);
        throw new Error("fm-seller not allowed to create product");
      }

      let payload = {
        name: req.body.name,
        profile_uuid: profile.uuid,
        brand_name: req.body.brand_name,
        price: req.body.price,
        discount: req.body.discount,
        data: req.body.data,
      };

      if (req.body.status) {
        payload["status"] = req.body.status;
      }

      if (profile) {
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

      let gmProduct = await GmProduct.findOne({
        where: {
          uuid: req.params.gm_product_uuid,
        },
      });

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
        payload["discount"] = { ...gmProduct.discount, ...req.body.discount };
      }

      if (req.body.data) {
        payload["data"] = { ...gmProduct.data, ...req.body.data };
      }

      if (req.body.status) {
        payload["status"] = req.body.status;
      }

      gmProduct = await gmProduct.update(payload);
      return gmProduct;
    } catch (error) {
      console.error(error);
    }
  },

  async getProductById(req, res) {
    try {
      let gmProduct = await GmProduct.findOne({
        attributes: {
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
      });
      return gmProduct;
    } catch (error) {
      consumeError(error);
    }
  },

  async getFilteredSellersProducts(req, res) {
    try {
      let where = {};
      console.log("req body", req.body);
      if (req.body.product_names) {
        where = {
          name: { [Op.in]: req.body.product_names },
        };
      }

      if (req.body.brand_names) {
        where = {
          ...where,
          brand_name: { [Op.in]: req.body.brand_names },
        };
      }

      // if (req.body.delivery && req.body.delivery.country) {
      //   where = {
      //     ...where,
      //     "data.delivery.country": req.body.delivery.country,
      //   };
      //   if (req.body.delivery.city) {
      //     where = {
      //       ...where,
      //       "data.delivery.city": { [Op.in]: req.body.cities },
      //     };
      //   }
      // }

      const gmCategory = req.body.category;

      const gmCategoryUuidOptions = gmCategory
        ? {
            model: GmCategory,
            as: "gmCategories",
            attributes: {
              exclude: ["createdAt", "updatedAt"],
            },
            where: {
              uuid: gmCategory,
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
        where: where,
      });

      return gmProducts;
    } catch (error) {
      consumeError(error);
    }
  },
};
