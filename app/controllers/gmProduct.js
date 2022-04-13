const consumeError = require("../functions/consumeError");
const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const { Op } = require("sequelize");

module.exports = {
  async index(req, res) {
    try {
    } catch (error) {
      consumeError(error);
    }
  },

  async store(req, res) {
    try {
      const gmProduct = await GmProduct.create({
        name: req.body.name,
        profile_uuid: "0561c8fa-9d59-4af3-a931-237062e592f5",
        brand_name: req.body.brand_name,
        price: req.body.price,
        discount: req.body.discount,
      });
      const productCategories =
        req.body.categories.length !== 0
          ? await GmCategory.findAll({
              where: {
                uuid: {
                  [Op.or]: req.body.categories,
                },
              },
              attributes: ["uuid", "name"],
            })
          : [];

      gmProduct.setGmCategories(productCategories);
      gmProduct.categories = productCategories;
      return gmProduct;
    } catch (error) {
      console.error(error);
    }
  },

  async update(req, res) {
    try {
    } catch (error) {
      console.error(error);
    }
  },
};
