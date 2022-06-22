const dailyBidsSerializer = require("./dailyBidsSerializer");

module.exports = (req, res, next) => {
  let result = req["data"].map((i) => {
    return dailyBidsSerializer(i);
  });
  return result;
};
