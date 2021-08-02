const consumeError = require("../functions/consumeError");
const Product = require("../models").Product;
const ProductCategory = require("../models").ProductCategory;
const sequelize = require("../models").sequelize;
const { Op, QueryTypes } = require("sequelize");
module.exports = {
    async index(req, res) {
        try {
            // Split into categories and remove empty strings
            const categories = req.query.categories ?
                req.query.categories.split(",").filter(category => category) : null;
            // Code to check if cateogories are valid UUIDs
            // const uuidTestRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
            // if (categories && categories.some((value) => !uuidTestRegex.test(value))) {
            //     consumeError({
            //         message: "Invalid Category UUIDs",
            //         code: 422
            //     })
            // }
            // Check all products uuid with matching category uuids in pivot (M2M) table
            const productUuids = categories ? await sequelize.query(`
                SELECT product_uuid FROM pivot_products_categories WHERE category_uuid IN (:category_uuids) 
            `, {
                replacements: {
                    category_uuids: categories || [],
                },
                type: QueryTypes.SELECT
                // query output: [{product_uuid: '...' }, ...]
            }).then(uuids => uuids.map(obj => obj.product_uuid)) : null;

            const products = await Product.findAll({
                attributes: {
                    exclude: ["createdAt", "updatedAt"],
                },
                where: productUuids ? {
                    uuid: {
                        [Op.in]: productUuids
                    }
                } : {},
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
            consumeError(error);
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