const validatorBase = require("./base");

const constraints = {
  status: {
    presence: {
      allowEmpty: false,
      message: "^Status is required",
    },
    type: "string",
    inclusion: {
      within: ["rejected", "accepted"],
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
