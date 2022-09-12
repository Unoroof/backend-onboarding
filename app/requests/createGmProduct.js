const validatorBase = require("./base");
const GmCategory = require("../models").GmCategory;
const validate = require("validate.js");
var { currencyType } = require("./dropdowns.js");
const { Op } = require("sequelize");

function check(arr, input) {
  //   console.log("we are in check function", arr, input);
  const { length } = arr;
  const found = arr.some((el) => el.value === input);
  if (found) {
    console.log("condition success", found);
  } else {
    return "^" + "Currency value did not match, please enter in Upper case";
  }
}

validate.validators.myAsyncValidator = function (value) {
  return new validate.Promise(function (resolve, reject) {
    if (value.currency) {
      if (value.currency != "") {
        let array = currencyType();
        let dat = check(array, value.currency);
        resolve(dat);
      }
    } else {
      resolve("value not provided for currency");
    }
  });
};

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
    type: "string",
  },
  "price.currency": {
    presence: {
      allowEmpty: false,
      message: "^Please select currency",
    },
    type: "string",
  },
  "price.amount": {
    presence: {
      allowEmpty: false,
      message: "^Please enter amount",
    },
  },
  "price.unit": {
    presence: {
      allowEmpty: false,
      message: "^Please select unit",
    },
  },
  "data.country_of_origin": {
    presence: {
      allowEmpty: false,
      message: "^Please enter country of origin",
    },
  },
  "data.category": {
    presence: {
      allowEmpty: false,
      message: "^Please Select Category",
    },
  },
  price: {
    presence: {
      allowEmpty: false,
      message: "^Please enter Price",
    },
  },

  price: { myAsyncValidator: true },

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
