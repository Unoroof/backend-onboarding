const consumeError = require("../functions/consumeError");
const GmCategory = require("../models").GmCategory;
const getSearchQueries = require("../functions/getSearchQueries");

module.exports = {
  async index(req, res) {
    try {
      console.log("check here req.query.search", req.query.search);
      const gmCategories = await GmCategory.findAll({
        ...getSearchQueries(req.query.search),
      });

      return gmCategories;
    } catch (error) {
      consumeError(error);
    }
  },

  async store(req, res) {
    try {
      const gmCategory = await GmCategory.create({
        name: req.body.name,
      });
      return gmCategory;
    } catch (error) {
      console.error(error);
    }
  },
};
