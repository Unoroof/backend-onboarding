const validatorBase = require("./base");

const constraints = {
  category: {
    presence: {
      allowEmpty: false,
      message: "^Please add the category",
    },
    type: "string",
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
