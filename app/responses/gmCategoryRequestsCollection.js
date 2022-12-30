const gmCategoryRequestsSerializer = require("./gmCategoryRequestsSerializer");

module.exports = (req, res, next) => {
  let result = req["data"].map((i) => {
    return gmCategoryRequestsSerializer(i);
  });
  return result;
};
