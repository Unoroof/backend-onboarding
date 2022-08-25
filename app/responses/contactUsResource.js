const contactUsSerializer = require("./contactUsSerializer");

module.exports = (req, res, next) => {
  if (!req["data"]) return null;
  return contactUsSerializer(req["data"]);
};
