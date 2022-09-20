const validate = require("validate.js");
const GmCategory = require("../models").GmCategory;
const { Op } = require("sequelize");
var { check } = require("./inputCheckInArray.js");
var { currencyType, units } = require("./dropdowns.js");

validate.validators.currencyValidator = function (value) {
  return new validate.Promise(function (resolve, reject) {
    if (value) {
      if (value != "") {
        let array = currencyType();
        let dat = check(array, value);

        resolve(dat);
      }
    } else {
      resolve("value not provided for currency");
    }
  });
};

validate.validators.unitsValidator = function (value) {
  console.log("UNITS VALUEEE", value);
  return new validate.Promise(function (resolve, reject) {
    if (value) {
      if (value != "") {
        let array = units();
        console.log("UNITS ARRRAY", array);
        let dat = check(array, value);
        resolve(dat);
      }
    } else {
      resolve("value not provided for currency");
    }
  });
};

validate.validators.categoryValidator = function (value) {
  console.log("value....", value);
  return new validate.Promise(function (resolve, reject) {
    if (value) {
      const categories = value;
      console.log("category......", categories);
      const uuidTestRegex =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!categories || categories.length === 0)
        return resolve("One or more Categories are not valid ");

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
          console.log("count", count);
          return count === categories.length
            ? resolve()
            : resolve("One or more Categories are not valid ");
        });
      }
      return resolve("One or more Categories are not valid");
    } else {
      resolve("value not provided for category");
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

  "price.currency": { currencyValidator: true },
  "price.unit": { unitsValidator: true },

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
    categoryValidator: true,
  },
};

module.exports = constraints;
