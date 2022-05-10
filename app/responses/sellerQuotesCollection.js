const sellerQuotesResponseSerializer = require("./sellerQuotesResponseSerializer");

module.exports = (req, res, next) => {
  return sellerQuotesResponseSerializer(req["sellerQuotesResponse"]);
};
