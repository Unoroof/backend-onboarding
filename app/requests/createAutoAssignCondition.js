const validatorBase = require("./base");

const constraints = {
  matching_criteria: {
    presence: true,
  },
  assign_to: {
    presence: true,
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
