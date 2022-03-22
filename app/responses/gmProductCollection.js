const productSerializer = require("./gmProductSerializer");

module.exports = (req, res, next) => {
    let result = req["data"].map((i) => {
        return productSerializer(i);
    });
    return result;
};
