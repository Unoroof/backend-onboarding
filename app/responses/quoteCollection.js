const quoteSerializer = require("./quoteSerializer");

module.exports = (req, res, next) => {
  return quoteSerializer(req["quotes"]);
};
