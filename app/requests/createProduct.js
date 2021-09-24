const validatorBase = require("./base");
const Category = require("../models").Category;
const Product = require("../models").Product;
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
  categories: {
    presence: {
      allowEmpty: true,
    },
    type: "array",
    custom_callback: {
      message: "One or more Categories are not valid",
      callback: (req) => {
        const categories = req.body.categories;
        // check if the category is Uuid
        const uuidTestRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!categories || categories.length === 0) return true;
        // Check if the categories provided exist in the database
        if (
          validate.isArray(categories) &&
          categories.every((category) => uuidTestRegex.test(category))
        ) {
          return Category.count({
            where: {
              uuid: {
                [Op.or]: categories,
              },
            },
          }).then((count) => {
            return count === categories.length ? true : false;
          });
        }
        return false;
      },
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
