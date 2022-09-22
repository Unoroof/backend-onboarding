const models = require("../models");
const PopularProductEnquiry = models.PopularProductEnquiry;
const consumeError = require("../functions/consumeError");

module.exports = {
  async index(req, res) {
    try {
      let getAllPopularProductEnquiry = await PopularProductEnquiry.findAll({
        where: {},
      });
      return getAllPopularProductEnquiry;
    } catch (error) {
      consumeError(error);
    }
  },
  async create(req, res) {
    try {
      const popularProductEnquiry = await PopularProductEnquiry.create({
        name: req.body.name,
        user_uuid: req.body.user_uuid,
        status: req.body.status,
        product_name: req.body.product_name,
        mobile_number: req.body.mobile_number,
        company_name: req.body.company_name,
        requirement_description: req.body.requirement_description,
        product_uuid: req.body.product_uuid,
      });
      return popularProductEnquiry;
    } catch (error) {
      consumeError(error);
    }
  },
};
