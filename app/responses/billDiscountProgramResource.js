const billDiscountProgramSerializer = require("./billDiscountProgramSerializer");

module.exports = (req, res, next) => {
  return billDiscountProgramSerializer(req["data"]);
};
