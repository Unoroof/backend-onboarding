const validatorBase = require("./base");

const constraints = {
  data: {
    presence: true,
  },
  status: {
    presence: true,
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
