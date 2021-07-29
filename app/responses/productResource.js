const productSerializer = require("./productSerializer");

module.exports = (req, res, next) => {
    if (!req['data']) return null;
    return productSerializer(req["data"]);
};
