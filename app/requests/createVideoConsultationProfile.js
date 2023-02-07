const validatorBase = require("./base");

const constraints = {
  currency_type: {
    presence: {
      allowEmpty: false,
      message: "^Select currency type",
    },
  },
  consultation_charge: {
    presence: {
      allowEmpty: false,
      message: "^Enter consultation charges",
    },
    type: "number",
  },
  area_of_specifications: {
    presence: {
      allowEmpty: false,
      message: "^Enter area of specifications",
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
