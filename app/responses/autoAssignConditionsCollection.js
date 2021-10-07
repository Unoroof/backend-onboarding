const autoAssignConditionSerializer = require("./autoAssignConditionSerializer");

module.exports = (req, res, next) => {
  let result = req["autoAssignCondition"].map((i) => {
    return autoAssignConditionSerializer(i);
  });
  return result;
};
