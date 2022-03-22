const validatorBase = require("./base");
const Category = require("../models").GMCategory;
const Product = require("../models").GMProduct;
const validate = require("validate.js");
const { Op } = require("sequelize");
const constraints = {
  name: {
    presence: {
      allowEmpty: false,
      message: "^Please enter a Name",
    },
    type: "string",
    custom_callback: {
      message: "Name should be valid and unique",
      callback: async (req) => {
        let count =
          typeof req.body.name === "string"
            ? await Product.count({
                where: {
                  name: req.body.name,
                },
              })
            : -1;
        return count === 0 ? true : false;
      },
    },
  },
  category: {
    presence: {
      allowEmpty: false,
    },
    type: "string",
    custom_callback: {
      message: "One or more Categories are not valid",
      callback: (req) => {
        const category = req.body.category;
        // check if the category is Uuid
        const uuidTestRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        // Check if the categories provided exist in the database
        if (uuidTestRegex.test(category)) {
          return true;
        }
        return false;
      },
    },
  },
  data: {
    presence: {
      allowEmpty: false,
      message: "^Please enter data",
    },
    type: "object",
    custom_callback: {
      message: "Data should be object",
      callback: async (req) => {
        const data = req.body.data;
        if (validate.isObject(data)) {
          return true;
        }
        return false;
      },
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
