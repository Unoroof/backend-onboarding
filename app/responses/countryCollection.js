const countrySerializer = require("./countrySerializer");

module.exports = (req, res, next) => {
    let result = req["countries"].map((i) => {
        return countrySerializer(i);
    });
    return result;
};

