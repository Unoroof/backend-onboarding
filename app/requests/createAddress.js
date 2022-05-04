const validatorBase = require("./base");
const Profile = require("../models").Profile;
const checkValidPincode = require("../functions/checkValidPincode");
const getAllCountries = require("../controllers/countryCity").getAllCountries;

const constraints = {
  location_name: {
    presence: {
      allowEmpty: false,
      message: "^Please enter location name",
    },
  },
  address: {
    presence: {
      allowEmpty: false,
      message: "^Please enter the address",
    },
  },
  country: {
    presence: {
      allowEmpty: true,
      message: "^Please enter the country",
    },
  },
  city: {
    presence: {
      allowEmpty: true,
      message: "^Please enter the city",
    },
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
          (country) => country.name === req.body.country
        );
        let countryCode = "";

        if (foundedCountry) {
          countryCode = foundedCountry.isoCode;
        }
        return checkValidPincode(req.body.pincode, countryCode).then((data) => {
          if (data) {
            if (data.status) {
              if (data.result.length > 0) {
                return true;
              }
            }
            return false;
          }
        });
      },
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
