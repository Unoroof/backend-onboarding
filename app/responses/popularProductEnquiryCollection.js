const popularProductEnquirySerializer = require("./popularProductEnquirySerializer");

module.exports = (req, res, next) => {
  let result = req["data"].map((i) => {
    return popularProductEnquirySerializer(i);
  });
  return result;
};
