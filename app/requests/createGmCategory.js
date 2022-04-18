const validatorBase = require("./base");
const GmCategory = require("../models").GmCategory;

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
            ? await GmCategory.count({
                where: {
                  name: req.body.name,
                },
              })
            : -1;
        return count === 0 ? true : false;
      },
    },
  },
};

module.exports = (...props) => {
  return validatorBase(constraints, ...props);
};
