const dailyBidsSerializer = require("./dailyBidsSerializer");

module.exports = (req, res, next) => {
  return dailyBidsSerializer(req["data"]);
};
