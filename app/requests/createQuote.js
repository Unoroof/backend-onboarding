const validatorBase = require("./base");
const Profile = require("../models").Profile;
const checkValidPincode = require("../functions/checkValidPincode");
const getAllCountries = require("../controllers/countryCity").getAllCountries;

const constraints = {
  type: {
    presence: {
      allowEmpty: false,
      message: "^Please enter the type",
    },
  },
  data: {
    presence: {
      allowEmpty: false,
      message: "^Please enter the data",
    },
  },
  "data.product_name": {
    presence: {
      allowEmpty: false,
      message: "^Please enter the product name",
    },
    type: "string",
  },
  "data.units": {
    presence: {
      allowEmpty: false,
      message: "^Please enter the units",
    },
    type: "string",
  },
  "data.quantity": {
    presence: {
      allowEmpty: false,
      message: "^Please enter the quantity",
    },
    type: "string",
  },
  "data.location_name": {
    presence: {
      allowEmpty: false,
      message: "^Please enter the location name",
    },
    type: "string",
  },
  "data.address": {
    presence: {
      allowEmpty: false,
      message: "^Please enter the address",
    },
    type: "string",
  },
  "data.country": {
    presence: {
      allowEmpty: false,
      message: "^Please enter the country",
    },
    type: "string",
  },
  "data.city": {
    presence: {
      allowEmpty: false,
      message: "^Please enter the city",
    },
    type: "string",
  },
  "data.pincode": {
    presence: {
      allowEmpty: false,
      message: "^Please enter the pincode",
    },
    type: "string",
    custom_callback: {
      message: "Please enter the valid pincode",
      callback: async (req) => {
        const countries = await getAllCountries();
        let foundedCountry = countries.find(
          (country) => country.name === req.body.data.country
        );
        let countryCode = "";

        if (foundedCountry) {
          countryCode = foundedCountry.isoCode;
        }
        return checkValidPincode(req.body.data.pincode, countryCode).then(
          (data) => {
            if (data) {
              if (data.status) {
                if (data.result.length > 0) {
                  return true;
                }
              }
              return false;
            }
          }
        );
      },
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
