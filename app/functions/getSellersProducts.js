const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const sequelize = require("../models").sequelize;
const _ = require("lodash");

module.exports = async function getSellersProducts(where) {
  let gmProducts = await GmProduct.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
      include: [
        [
          sequelize.literal(`(
                  SELECT "profiles"."data" FROM profiles
                  WHERE "profiles"."uuid" = "GmProduct"."profile_uuid"
                  )`),
          "profile_data",
        ],
      ],
    },
    include: {
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

  let products = JSON.parse(JSON.stringify(gmProducts));

  products = products.map((product) => {
    return { ...product, keyword: "product" };
  });

  return products;
};
