const gmCategoryRequestsSerializer = require("./gmCategoryRequestsSerializer");

module.exports = (req, res, next) => {
  if (!req["data"]) return null;
  return gmCategoryRequestsSerializer(req["data"]);
};
