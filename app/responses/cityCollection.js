const citySerializer = require("./citySerializer");

module.exports = (req, res, next) => {
    let result = req["cities"].map((i) => {
        return citySerializer(i);
    });
    return result;
};

