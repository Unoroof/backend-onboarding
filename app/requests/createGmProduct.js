const validatorBase = require("./base");
const GmCategory = require("../models").GmCategory;
const validate = require("validate.js");
const { Op } = require("sequelize");

const constraints = {
  name: {
    presence: {
      allowEmpty: false,
      message: "^Please enter a Product Name",
    },
    type: "string",
  },
  brand_name: {
    presence: {
      allowEmpty: false,
      message: "^Please enter a Brand Name",
    },
  },
  price: {
    presence: {
      allowEmpty: false,
      message: "^Please enter Price",
    },
  },
  discount: {
    presence: {
      allowEmpty: true,
    },
  },
  categories: {
    presence: {
      allowEmpty: false,
    },
    type: "array",
    custom_callback: {
      message: "One or more Categories are not valid",
      callback: (req) => {
        const categories = req.body.categories;
        const uuidTestRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!categories || categories.length === 0) return true;

        if (
          validate.isArray(categories) &&
          categories.every((category) => uuidTestRegex.test(category))
        ) {
          return GmCategory.count({
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
