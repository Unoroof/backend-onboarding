const gmProductSerializer = require("./gmProductSerializer");

module.exports = (req, res, next) => {
  let result = req["data"].map((i) => {
    return gmProductSerializer(i);
  });
  return result;
};
