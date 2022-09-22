const consumeError = require("../functions/consumeError");
const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const Profile = require("../models").Profile;
const { Op, Sequelize } = require("sequelize");
const constraints = require("../requests/createGmProductsConstraints");
const validate = require("validate.js");
const createOrUpdateDropdowns = require("../functions/createOrUpdateDropdowns");

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

const updateDropdownOptions = async (product) => {
  console.log("product......", product);
  try {
    // let additionalProductsDropdowns = ['product_form', 'product_grade'];
    // let additionalProductInfo = product.data?.additional_product_info;

    // additionalProductsDropdowns.map((dropdownName) => {
    //   let dropdownValuesFromPayload = additionalProductInfo[dropdownName];
    //   if (
    //     dropdownValuesFromPayload &&
    //     dropdownValuesFromPayload.label &&
    //     dropdownValuesFromPayload.value &&
    //     dropdownValuesFromPayload.type
    //   ) {
    //     await createOrUpdateDropdowns(dropdownValuesFromPayload);
    //   }
    // })

    const productForm = product.data?.additional_product_info?.product_form;
    if (
      productForm &&
      productForm.label &&
      productForm.value &&
      productForm.type
    ) {
      await createOrUpdateDropdowns(productForm);
    }

    const productGrade = product.data?.additional_product_info?.product_grade;
    if (
      productGrade &&
      productGrade.label &&
      productGrade.value &&
      productGrade.type
    ) {
      await createOrUpdateDropdowns(productGrade);
    }

    const productApplication =
      product.data?.additional_product_info?.product_application;
    if (
      productApplication &&
      productApplication.label &&
      productApplication.value &&
      productApplication.type
    ) {
      await createOrUpdateDropdowns(productApplication);
    }

    const packagingType = product.data?.additional_product_info?.packaging_type;
    if (
      packagingType &&
      packagingType.label &&
      packagingType.value &&
      packagingType.type
    ) {
      await createOrUpdateDropdowns(packagingType);
    }

    const productType = product.data?.additional_product_info?.product_type;
    if (
      productType &&
      productType.label &&
      productType.value &&
      productType.type
    ) {
      await createOrUpdateDropdowns(productType);
    }
  } catch (e) {
    console.log("Error while update dropdown value", e);
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
          await updateDropdownOptions(product);

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
