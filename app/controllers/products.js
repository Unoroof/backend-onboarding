const Product = require("../models").Product;
const ProductCategory = require("../models").ProductCategory;
const { Op } = require("sequelize");
module.exports = {
    async index(req, res) {
        try {
            const products = await Product.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                include: {
                    model: ProductCategory,
                    as: "categories",
                    attributes: {
                        exclude: ["createdAt", "updatedAt"],
                    },
                    through: {
                        attributes: [],
                    },
                },
                distinct: true,
            });
            return products;

        } catch (error) {
            console.error(error);
        }
    },
    async update(req, res) { },
    async store(req, res) {
        try {
            const newProduct = await Product.create({
                name: req.body.name
            });
            const productCategories = req.body.categories.length !== 0
                ? await ProductCategory.findAll({
                    where: {
                        uuid: {
                            [Op.or]: req.body.categories,
                        },
                    },
                    attributes: ["uuid", "name"],
                })
                : [];
            newProduct.setCategories(productCategories);
            newProduct.categories = productCategories;
            return newProduct;
        } catch (error) {
            console.error(error);
        }
    },
}