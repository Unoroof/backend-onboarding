const validatorBase = require("./base");
const Profile = require("../models").Profile;
const checkValidPincode = require("../functions/checkValidPincode");
const getAllCountries = require("../controllers/countryCity").getAllCountries;

const constraints = {
  profile_uuid: {
    presence: {
      allowEmpty: false,
      message: "^Please add profile_uuid",
    },
    type: "string",
    custom_callback: {
      message: "Please add valid profile_uuid",
      callback: (req) => {
        const uuidTestRegex =
          /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

        if (uuidTestRegex.test(req.body.profile_uuid)) {
          return Profile.count({
            where: {
              uuid: req.body.profile_uuid,
            },
          }).then((count) => {
            return count === 1 ? true : false;
          });
        }
        return false;
      },
    },
  },
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
