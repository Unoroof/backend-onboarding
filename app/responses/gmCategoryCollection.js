const gmCategorySerializer = require("./gmCategorySerializer");

module.exports = (req, res, next) => {
  let result = req["data"].map((i) => {
    return gmCategorySerializer(i);
  });
  return result;
};
