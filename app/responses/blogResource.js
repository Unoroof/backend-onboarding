const blogSerializer = require("./blogSerializer");

module.exports = (req, res, next) => {
  return blogSerializer(req["data"]);
};
