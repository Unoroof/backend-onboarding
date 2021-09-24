const querySerializer = require("./querySerializer");

module.exports = (req, res, next) => {
  return querySerializer(req["data"]);
};
