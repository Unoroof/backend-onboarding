const addressSerializer = require("./addressSerializer");

module.exports = (req, res, next) => {
  let result = req["address"].map((i) => {
    return addressSerializer(i);
  });
  return result;
};
