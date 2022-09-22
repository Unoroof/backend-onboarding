const validate = require("validate.js");
const validatorBase = require("./base");
const GmCategory = require("../models").GmCategory;
const { Op } = require("sequelize");
const constraints = require("./createGmProductsConstraints");

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
