const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const sequelize = require("../models").sequelize;
const _ = require("lodash");

module.exports = async function getSellersProducts(where) {
  let sellersProducts = [];
  let gmProducts = await GmProduct.findAll({
    attributes: {
      exclude: ["createdAt", "updatedAt"],
      include: [
        sequelize.literal(`(
                  SELECT "profiles"."data" FROM profiles
                  WHERE "profiles"."uuid" = "GmProduct"."profile_uuid"
                  )`),
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

  await Promise.all(
    gmProducts.map(async (product) => {
      let obj = product;
      const foundedProduct = await GmProduct.findOne({
        where: { uuid: product.uuid },
      });
      obj = JSON.parse(JSON.stringify(obj));

      obj = { ...obj, data: foundedProduct.data, seller_data: obj.data };

      sellersProducts.push(obj);
    })
  );
  return _.uniqBy(sellersProducts, "uuid");
};
