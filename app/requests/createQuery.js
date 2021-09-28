const validatorBase = require("./base");

const constraints = {
  type: {
    presence: true,
    custom_callback: {
      message: "Invalid Value of Type",
      callback: (req) => {
        const validTypes = [
          "refinance_existing_loan",
          "corporate_finance_product",
        ];
        return validTypes.includes(req.body.type);
      },
    },
  },
  data: {
    presence: true,
  },
  sellers: {
    presence: true,
  },
  status: {
    presence: true,
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
