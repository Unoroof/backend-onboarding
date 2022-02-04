const validatorBase = require("./base");

const constraints = {
  type: {
    presence: true,
    custom_callback: {
      message: "Invalid Value of Type",
      callback: (req) => {
        const validTypes = ["for_product", "for_partner", "for_credit_profile"];
        return validTypes.includes(req.body.type);
      },
    },
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
