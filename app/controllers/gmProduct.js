const consumeError = require("../functions/consumeError");
const Product = require("../models").GMProduct;
const Category = require("../models").GMCategory;
const sequelize = require("../models").sequelize;
const { Op, QueryTypes } = require("sequelize");
const getSearchQueries = require("../functions/getSearchQueries");

module.exports = {
  async index(req, res) {
    try {
      console.log("req.query", req.query);
      const categories = req.query.categories
        ? req.query.categories.split(",").filter((category) => category)
        : [];

      console.log("gm-products: filter by these categories--> ", categories);

      const categoryUuidOptions =
        categories.length !== 0
          ? {
              model: Category,
              as: "categories",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              where: {
                uuid: { [Op.in]: categories },
              },
              through: {
                as: "gm_products_categories",
              },
            }
          : {
              model: Category,
              as: "categories",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            };

      console.log(
        "gm-products: categoryUuidOptions====",
        JSON.stringify(categoryUuidOptions)
      );

      let products = await Product.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: categoryUuidOptions,
        ...getSearchQueries(req.query.search),
        distinct: true,
      });

      return products;
    } catch (error) {
      consumeError(error);
    }
  },
  async store(req, res) {
    try {
      console.log("req.body of gm-product add", req.body);
      const newProduct = await Product.create({
        name: req.body.name,
      });
      const productCategories =
        req.body.categories.length !== 0
          ? await Category.findAll({
              where: {
                uuid: {
                  [Op.or]: req.body.categories,
                },
              },
              attributes: ["uuid", "name"],
            })
          : [];
      console.log("gm-productCategories======", productCategories);
      // Todo
      // newProduct.setCategories([uuid1, uuid2]);

      // Todo
      // newProduct.setCategories([{}, {}]);

      newProduct.setCategories(productCategories);
      newProduct.categories = productCategories;
      return newProduct;
    } catch (error) {
      console.error(error);
    }
  },
};
