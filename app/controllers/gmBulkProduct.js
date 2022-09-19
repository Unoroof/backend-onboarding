const consumeError = require("../functions/consumeError");
const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const Profile = require("../models").Profile;
const { Op, Sequelize } = require("sequelize");
const getSearchQueries = require("../functions/getSearchQueries");
const getGmProducts = require("../functions/getGmProducts");
const getCompanyProducts = require("../functions/getCompanyProducts");

const sequelize = require("../models").sequelize;

module.exports = {
  async store(req, res) {
    // console.log("body", req.body);
    // return req.body;
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      if (profile) {
        for (let index = 0; index < req.body.products.length; index++) {
          const product = req.body.products[index];
          let payload = {
            name: product.name,
            profile_uuid: profile.uuid,
            brand_name: product.brand_name,
            price: product.price,
            discount: product.discount,
            data: product.data,
          };

          if (product.status) {
            payload["status"] = product.status;
          }

          const gmProduct = await GmProduct.create(payload);

          const productCategories =
            product.categories.length !== 0
              ? await GmCategory.findAll({
                  where: {
                    uuid: {
                      [Op.or]: product.categories,
                    },
                  },
                  attributes: ["uuid", "name"],
                })
              : [];

          gmProduct.setGmCategories(productCategories);
          gmProduct.categories = productCategories;
        }
        return "done";
      } else {
        throw new Error("To add product user has to be onboarded!");
      }
    } catch (error) {
      consumeError(error);
    }
  },

  async validate(req, res) {
    // console.log("body", req.body);
    // return req.body;
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      if (profile) {
        let validatedProducts = [];
        let invalidProductCount = 0;

        for (let index = 0; index < req.body.products.length; index++) {
          const product = req.body.products[index];
          rowNumber = index + 1;
          product["rowNumber"] = rowNumber;
          // Validate the product
          // let result = await validateTheProduct(product);
          let result = false;

          if (result == false) {
            invalidProductCount = invalidProductCount + 1;
          }

          product["validation_result"] = result;
          validatedProducts.push(product);
        }

        return {
          products: validatedProducts,
          invalidProductCount: invalidProductCount,
        };
      } else {
        throw new Error("To add product user has to be onBoarded!");
      }
    } catch (error) {
      consumeError(error);
    }
  },
};
