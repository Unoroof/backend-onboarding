// Controller of Product Categories
const consumeError = require("../functions/consumeError");
const Category = require("../models").Category;
module.exports = {
  async index(req, res) {
    try {
      const productCategories = await Category.findAll();
      return productCategories;
    } catch (error) {
      consumeError(error);
    }
  },
  async store(req, res) {
    try {
      const newProductCategory = await Category.create({
        name: req.body.name,
      });
      return newProductCategory;
    } catch (error) {
      consumeError(error);
    }
  },
};
