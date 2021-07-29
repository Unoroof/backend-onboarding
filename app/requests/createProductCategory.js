const validatorBase = require("./base");
const ProductCategory = require("../models").ProductCategory;

const constraints = {
    name: {
        presence: {
            allowEmpty: false,
            message: "^Please enter a Name",
        },
        format: {
            pattern: "^[A-Za-z0-9 ]+$",
            flags: "i",
            message: "^Name should not contain special characters"
        },
        type: "string",
        custom_callback: {
            message: "^Name should be valid and unique",
            callback: async (req) => {
                let count = typeof req.body.name === "string" ? await ProductCategory.count({
                    where: {
                        name: req.body.name,
                    },
                }) : -1;
                return count === 0 ? true : false;
            },
        },
    },
};

module.exports = (...props) => {
    return validatorBase(constraints, ...props);
};
