const validatorBase = require("./base");

const constraints = {
  name: {
    presence: {
      allowEmpty: false,
      message: "^Please enter name",
    },
    type: "string",
  },
  mobile_number: {
    presence: {
      allowEmpty: false,
      message: "^Please enter your Mobile number",
    },
    type: "string",
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
