const sellerQuoteResponsesSerializer = require("./sellerQuoteResponsesSerializer");

module.exports = (req, res, next) => {
  return sellerQuoteResponsesSerializer(req["sellerQuoteResponses"]);
};
