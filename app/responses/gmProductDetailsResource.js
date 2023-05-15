const gmProductDetailsSerializer = require("./gmProductDetailsSerializer");

module.exports = (req, res, next) => {
  if (!req["data"]) return null;
  return gmProductDetailsSerializer(req["data"]);
};
