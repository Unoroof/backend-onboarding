const popularProductEnquirySerializer = require("./popularProductEnquirySerializer");

module.exports = (req, res, next) => {
  if (!req["data"]) return null;
  return popularProductEnquirySerializer(req["data"]);
};
