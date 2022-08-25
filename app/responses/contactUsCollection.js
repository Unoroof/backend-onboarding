const contactUsSerializer = require("./contactUsSerializer");

module.exports = (req, res, next) => {
  let result = req["data"].map((i) => {
    return contactUsSerializer(i);
  });
  return result;
};
