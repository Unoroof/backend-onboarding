const validatorBase = require("./base");
const checkValidPincode = require("../functions/checkValidPincode");
const getAllCountries = require("../controllers/countryCity").getAllCountries;

const constraints = {
  type: {
    presence: {
      allowEmpty: false,
      message: "^Please add the type",
    },
    type: "string",
    custom_callback: {
      message: "Invalid value of type",
      callback: (req) => {
        const validTypes = ["best_bids_quote", "customized_quote"];
        return validTypes.includes(req.body.type);
      },
    },
  },
  data: {
    presence: {
      allowEmpty: false,
      message: "^Please enter the data",
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
