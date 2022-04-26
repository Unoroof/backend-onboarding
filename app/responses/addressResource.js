const addressSerializer = require("./addressSerializer");

module.exports = (req, res, next) => {
  if (!req["data"]) return null;
  return addressSerializer(req["data"]);
};
