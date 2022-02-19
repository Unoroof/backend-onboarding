const productRequestSerializer = require("./productRequestSerializer");

module.exports = (req, res, next) => {
    let result = req["data"].map((i) => {
        return productRequestSerializer(i);
    });
    return result;
};
