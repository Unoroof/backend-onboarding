const validatorBase = require("./base");
const Profile = require("../models").Profile;

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
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
