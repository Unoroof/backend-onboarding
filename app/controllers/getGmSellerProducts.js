const consumeError = require("../functions/consumeError");
const models = require("../models");
const Profile = models.Profile;

module.exports = {
  async getGmSellerProducts(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });
      const createSearch = { profile_uuid: req.user, data: req.body };
      return createSearch;
    } catch (error) {
      console.log("err-1234", error);
      consumeError(error);
    }
  },
};
