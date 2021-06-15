const profileSerializer = require("./profileSerializer");

module.exports = (req, res, next) => {
  return profileSerializer(req["data"]);
};
