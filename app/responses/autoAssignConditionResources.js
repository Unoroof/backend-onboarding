const queryResponseSerializer = require("./queryResponseSerializer");

module.exports = (req, res, next) => {
  return queryResponseSerializer(req["autoAssignCondition"]);
};
