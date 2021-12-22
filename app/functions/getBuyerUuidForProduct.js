const product = require("../controllers/product");
const models = require("../models");
const Queries = models.Queries;
const consumeError = require("./consumeError");

module.exports = async (product) => {
  try {
    let buyerProfileUuids = [];

    let constraints = {
      where: {
        data: {
          product: {
            label: product,
          },
        },
      },
    };

    let queries = await Queries.findAll(constraints);

    await Promise.all(
      await queries.map(async (query) => {
        buyerProfileUuids.push(query.profile_uuid);
      })
    );

    return buyerProfileUuids;
  } catch (error) {
    consumeError(error);
  }
};
