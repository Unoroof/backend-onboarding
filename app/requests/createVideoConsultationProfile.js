const validatorBase = require("./base");
const validate = require("validate.js");

validate.validators.officialEmailValidator = function (value, flag, key, data) {
  return new validate.Promise(function (resolve, reject) {
    if (value) {
      const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
      if (!emailRegex.test(value)) resolve("^Enter valid official email");

      resolve();
    } else {
      resolve();
    }
  });
};

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
  official_email_id: {
    presence: true,
    officialEmailValidator: true,
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
