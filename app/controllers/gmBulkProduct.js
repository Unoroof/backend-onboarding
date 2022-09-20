const consumeError = require("../functions/consumeError");
const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const Profile = require("../models").Profile;
const { Op, Sequelize } = require("sequelize");
const getSearchQueries = require("../functions/getSearchQueries");
const getGmProducts = require("../functions/getGmProducts");
const getCompanyProducts = require("../functions/getCompanyProducts");
const constraints = require("../requests/createGmProductsConstraints");

const sequelize = require("../models").sequelize;
const validate = require("validate.js");

const validateProduct = async (product) => {
  try {
    await validate.async(product, constraints, {
      format: "detailed",
    });
    return {};
  } catch (e) {
    let errors = {};

    if (Array.isArray(e)) {
      e.map((d) => {
        errors[d.attribute] = d.error;
        return d;
      });
      console.log("errors....", errors);
      return errors;
    } else {
      throw e;
    }
  }
};

module.exports = {
  async store(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      let totalNumberOfProductsAdded = 0;

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

          // Optional dropdown values need to be saved? => YES (Shubham)
          /**
           * Each product can have new dropdown values for the following fields: Product Form, Packaging Type, Grade, Product Application, Product Type
           * for each product
           *    - check if the product contains any of the above 5 dropdown attributes.
           *    - For such product, call the createOrUpdateDropdowns function for each dropdown type.
           */

          // Need to maintain the flag for products which created from  bulk upload - Not right now (Shubham)

          const gmProduct = await GmProduct.create(payload);
          totalNumberOfProductsAdded = totalNumberOfProductsAdded + 1;

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
        return { total_products_added: totalNumberOfProductsAdded };
      } else {
        throw new Error("To add product user has to be onboarded!");
      }
    } catch (error) {
      consumeError(error);
    }
  },

  async validate(req, res) {
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
          // Validate product method will returns either empty object or object with error keys
          const validationResult = await validateProduct(product, constraints);
          console.log("validate res....", validationResult);

          if (Object.keys(validationResult).length > 0) {
            invalidProductCount = invalidProductCount + 1;
          }

          product["validation_result"] = validationResult;
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
