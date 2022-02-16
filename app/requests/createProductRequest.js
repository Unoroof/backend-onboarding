const validatorBase = require("./base");

const constraints = {
  product_name: {
    presence: true,
  }
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
