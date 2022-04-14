const consumeError = require("../functions/consumeError");
const GmProduct = require("../models").GmProduct;
const GmCategory = require("../models").GmCategory;
const Profile = require("../models").Profile;
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
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      let payload = {
        name: req.body.name,
        profile_uuid: profile.uuid,
        brand_name: req.body.brand_name,
        price: req.body.price,
        discount: req.body.discount,
        data: req.body.data,
      };

      if (req.body.status) {
        payload["status"] = req.body.status;
      }

      if (profile) {
        const gmProduct = await GmProduct.create(payload);
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
      } else {
        throw new Error("To add product user has to be onboarded!");
      }
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
    } catch (error) {
      console.error(error);
    }
  },
};
