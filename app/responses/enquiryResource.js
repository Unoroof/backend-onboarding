const enquirySerializer = require("./enquirySerializer");

module.exports = (req, res, next) => {
  return enquirySerializer(req["data"]);
};
