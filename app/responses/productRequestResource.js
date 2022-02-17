const productRequestSerializer = require("./productRequestSerializer");

module.exports = (req, res, next) => {
    if (!req['data']) return null;
    return productRequestSerializer(req["data"]);
};
