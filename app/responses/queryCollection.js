const querySerializer = require("./querySerializer");

module.exports = (req, res, next) => {
  let result = req["queries"].map((i) => {
    return querySerializer(i);
  });
  return result;
};
