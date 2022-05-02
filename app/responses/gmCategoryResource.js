const gmCategorySerializer = require("./gmCategorySerializer");

module.exports = (req, res, next) => {
  return gmCategorySerializer(req["data"]);
};
