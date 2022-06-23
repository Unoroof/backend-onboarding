const billDiscountProgramSerializer = require("./billDiscountProgramSerializer");

module.exports = (req, res, next) => {
  let result = req["data"].map((i) => {
    return billDiscountProgramSerializer(i);
  });
  return result;
};
