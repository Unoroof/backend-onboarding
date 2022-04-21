const quoteSerializer = require("./quoteSerializer");

module.exports = (req, res, next) => {
  console.log("req", req);
  let result = req["quotes"].map((i) => {
    return quoteSerializer(i);
  });
  return result;
};
