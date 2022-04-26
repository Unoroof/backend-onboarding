const validatorBase = require("./base");
const Profile = require("../models").Profile;
const checkValidPincode = require("../functions/checkValidPincode");
const getAllCountries = require("../controllers/countryCity").getAllCountries;

const constraints = {
  seller_uuid: {
    presence: {
      allowEmpty: false,
      message: "^Please add seller uuid",
    },
    type: "string",
    custom_callback: {
      message: "Please enter valid seller_uuid",
      callback: (req) => {
        const sellerId = req.body.seller_uuid;
        const uuidTestRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        if (!sellerId) return true;

        if (uuidTestRegex.test(sellerId)) {
          return Profile.count({
            where: {
              uuid: sellerId,
            },
          }).then((count) => {
            return count === 1 ? true : false;
          });
        }
        return false;
      },
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
  "data.unit": {
    presence: {
      allowEmpty: false,
      message: "^Please enter the unit",
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
  pincode: {
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
