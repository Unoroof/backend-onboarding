const validatorBase = require("./base");

const constraints = {
  // Todo - For "type" also check if type is valid, as in it exists in array of valid values - fm-seller, fm-buyer etc., .
  type: {
    presence: true,
  },
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
