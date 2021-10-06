const queryResponseSerializer = require("./queryResponseSerializer");

module.exports = (req, res, next) => {
  let result = req["autoAssignCondition"].map((i) => {
    return queryResponseSerializer(i);
  });
  return result;
};
