const queryResponseSerializer = require("./queryResponseSerializer");

module.exports = (req, res, next) => {
  let result = req["queryResponse"].map((i) => {
    return queryResponseSerializer(i);
  });
  return result;
};
