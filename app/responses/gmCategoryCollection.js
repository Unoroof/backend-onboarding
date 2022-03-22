const categorySerializer = require("./gmCategorySerializer");

module.exports = (req, res, next) => {
  let result = req["data"].map((i) => {
    return categorySerializer(i);
  });
  return result;
};
