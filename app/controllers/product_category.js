// Controller of Product Categories
const consumeError = require("../functions/consumeError")
const ProductCategory = require("../models").ProductCategory;
module.exports = {
    async index(req, res) {
        try {
            const productCategories = ProductCategory.findAll();
            return productCategories;
        } catch (error) {
            consumeError(error);
        }
    },
    async store(req, res) {

        try {
            const newProductCategory = ProductCategory.create({
                name: req.body.name
            });
            return newProductCategory;
        } catch (error) {
            consumeError(error);
        }
    },
}