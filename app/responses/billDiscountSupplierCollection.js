const billDiscountSupplierSerializer = require("./billDiscountSupplierSerializer");

module.exports = (req, res, next) => {
  let result = req["data"].map((i) => {
    return billDiscountSupplierSerializer(i);
  });
  return result;
};
