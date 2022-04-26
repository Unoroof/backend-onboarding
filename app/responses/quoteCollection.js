const quoteSerializer = require("./quoteSerializer");

module.exports = (req, res, next) => {
  let result = req["quotes"].map((i) => {
    return quoteSerializer(i);
  });
  return result;
};
