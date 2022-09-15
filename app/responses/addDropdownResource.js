const addDropdownSerializer = require("./addDropdownSerializer");

module.exports = (req, res, next) => {
  if (!req["data"]) return null;
  return addDropdownSerializer(req["data"]);
};
