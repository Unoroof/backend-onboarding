// const models = require("../models");
// const SearchFilter = models.SearchFilter;
// const searchFilterGmProducts = models.searchFilterGmProducts;
const consumeError = require("../functions/consumeError");

module.exports = {
  async create(req, res) {
    try {
      const createSearch = req.body;
      return createSearch;
    } catch (error) {
      console.log("err-1234", error);
      consumeError(error);
    }
  },
};
