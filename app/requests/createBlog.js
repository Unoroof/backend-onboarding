const validatorBase = require("./base");

const constraints = {
  title: {
    presence: {
      allowEmpty: false,
      message: "^Please enter title",
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
