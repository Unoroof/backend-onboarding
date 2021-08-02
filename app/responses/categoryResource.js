const categorySerializer = require("./categorySerializer");

module.exports = (req, res, next) => {
    return categorySerializer(req["data"]);
};
