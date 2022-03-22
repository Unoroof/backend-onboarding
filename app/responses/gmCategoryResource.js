const categorySerializer = require("./gmCategorySerializer");

module.exports = (req, res, next) => {
  return categorySerializer(req["data"]);
};
