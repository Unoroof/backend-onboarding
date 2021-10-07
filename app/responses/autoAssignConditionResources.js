const autoAssignConditionSerializer = require("./autoAssignConditionSerializer");

module.exports = (req, res, next) => {
  return autoAssignConditionSerializer(req["data"]);
};
