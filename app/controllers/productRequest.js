const models = require("../models");
const product_requests = models.product_requests;
const consumeError = require("../functions/consumeError");

module.exports = {
  async getAll(req, res) {
    try {
      let constraints = {
        where: {},
      };
      let productRequests = await product_requests.findAll(constraints);
      return productRequests;
    } catch (error) {
      consumeError(error);
    }
  },

  async create(req, res) {
    try {
      const productRequest = await product_requests.create({
        product_name: req.body.product_name,
      });
      return productRequest;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let productRequest = await product_requests.findOne({
        where: {
          uuid: req.params.product_request_uuid,
        },
      });
      productRequest = await productRequest.update({
        status: req.body.status,
      });
      return productRequest;
    } catch (error) {
      consumeError(error);
    }
  },
};
