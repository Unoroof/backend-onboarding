const validatorBase = require("./base");

const constraints = {
  label: {
    presence: {
      allowEmpty: false,
      message: "^Please enter label",
    },
    type: "string",
  },
  value: {
    presence: {
      allowEmpty: false,
      message: "^Please enter value",
    },
    type: "string",
  },
  type: {
    presence: {
      allowEmpty: false,
      message: "^Please enter type",
    },
    type: "string",
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
