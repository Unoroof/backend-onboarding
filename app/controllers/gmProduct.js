const consumeError = require("../functions/consumeError");
const Product = require("../models").GMProduct;
const Category = require("../models").GMCategory;
const sequelize = require("../models").sequelize;
const { Op, QueryTypes } = require("sequelize");
const getGMBidsSearchFilterQueries = require("../functions/getGMBidsSearchFilterQueries");

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
        ...getGMBidsSearchFilterQueries(req.query),
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
        category: req.body.category,
        data: req.body.data,
      });
      console.log("category", req.body.category);
      const productCategory = req.body.category
        ? await Category.findAll({
            where: {
              uuid: req.body.category,
            },
            attributes: ["uuid", "name"],
          })
        : [];

      console.log("productCategory======", productCategory);
      // Todo
      // newProduct.setCategories([uuid1, uuid2]);

      // Todo
      // newProduct.setCategories([{}, {}]);

      newProduct.setCategories(productCategory);
      newProduct.categories = productCategory;
      return newProduct;
    } catch (error) {
      console.error(error);
    }
  },
};
