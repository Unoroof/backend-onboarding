const consumeError = require("../functions/consumeError");
const GmCategory = require("../models").GmCategory;

module.exports = {
  async index(req, res) {
    try {
    } catch (error) {
      consumeError(error);
    }
  },

  async store(req, res) {
    try {
    } catch (error) {
      console.error(error);
    }
  },
};
