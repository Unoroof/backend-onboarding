const billDiscountSupplierSerializer = require("./billDiscountSupplierSerializer");

module.exports = (req, res, next) => {
  return billDiscountSupplierSerializer(req["data"]);
};
