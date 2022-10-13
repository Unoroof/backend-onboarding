const searchFilterSerializer = require("./searchFilterSerializer");

module.exports = (req, res, next) => {
  if (!req["data"]) return null;
  return req["data"];
};
