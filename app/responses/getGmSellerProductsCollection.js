const searchFilterSerializer = require("./searchFilterSerializer");

module.exports = (req, res, next) => {
  let result = req["address"].map((i) => {
    return searchFilterSerializer(i);
  });
  return result;
};
