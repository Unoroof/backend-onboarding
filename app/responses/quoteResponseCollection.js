const quoteResponseSerializer = require("./quoteResponseSerializer");

module.exports = (req, res, next) => {
  return quoteResponseSerializer(req["quoteResponse"]);
};
