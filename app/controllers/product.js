const consumeError = require("../functions/consumeError");
const Product = require("../models").Product;
const Category = require("../models").Category;
const sequelize = require("../models").sequelize;
const { Op, QueryTypes } = require("sequelize");

module.exports = {
  async index(req, res) {
    try {
      const categories = req.query.categories
        ? req.query.categories.split(",").filter((category) => category)
        : [];

      const categoryUuidOptions =
        categories.length !== 0
          ? {
              model: Category,
              as: "categories",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
              where: {
                uuid: {
                  [Op.in]: categories,
                },
              },
              through: {
                as: "fm_products_categories",
              },
            }
          : {
              model: Category,
              as: "categories",
              attributes: {
                exclude: ["createdAt", "updatedAt"],
              },
            };
      let products = await Product.findAll({
        attributes: {
          exclude: ["createdAt", "updatedAt"],
        },
        include: categoryUuidOptions,
        distinct: true,
      });

      return products;
    } catch (error) {
      consumeError(error);
    }
  },
  async store(req, res) {
    try {
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

      console.log("productCategories======", productCategories);
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
