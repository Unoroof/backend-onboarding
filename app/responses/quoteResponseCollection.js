const quoteResponseSerializer = require("./quoteResponseSerializer");

module.exports = (req, res, next) => {
  let result = req["quoteResponse"].map((i) => {
    return quoteResponseSerializer(i);
  });
  return result;
};
