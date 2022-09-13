const gmBulkProductSerializer = require("./gmBulkProductSerializer");

module.exports = (req, res, next) => {
  if (!req["data"]) return null;
  return gmBulkProductSerializer(req["data"]);
};
