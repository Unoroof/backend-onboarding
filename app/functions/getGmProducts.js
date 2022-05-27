const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const sequelize = require("../models").sequelize;

module.exports = async function getGmProducts(where, keywordType) {
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
    return { ...product, keyword: keywordType };
  });

  return products;
};
