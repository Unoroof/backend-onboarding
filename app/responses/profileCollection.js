const profileSerializer = require("./profileSerializer");

module.exports = (req, res, next) => {
  let result = req["profileList"].map((i) => {
    return profileSerializer(i);
  });
  return result;
};
