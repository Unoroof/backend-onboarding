const gmProductSerializer = require("./gmProductSerializer");

module.exports = (req, res, next) => {
  if (!req["data"]) return null;
  return gmProductSerializer(req["data"]);
};
