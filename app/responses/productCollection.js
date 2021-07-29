const productSerializer = require("./productSerializer");

module.exports = (req, res, next) => {
    let result = req["data"].map((i) => {
        return productSerializer(i);
    });
    return result;
};
