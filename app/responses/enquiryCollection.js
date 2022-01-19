const enquirySerializer = require("./enquirySerializer");

module.exports = (req, res, next) => {
  let result = req["enquiry"].map((i) => {
    return enquirySerializer(i);
  });
  return result;
};
