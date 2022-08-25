const validatorBase = require("./base");
const ContactsUsLeads = require("../models").ContactsUsLeads;
const validate = require("validate.js");
const { Op } = require("sequelize");

const constraints = {
  mobile_number: {
    presence: {
      allowEmpty: false,
      message: "^Please enter your Mobile number",
    },
    type: "string",
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
