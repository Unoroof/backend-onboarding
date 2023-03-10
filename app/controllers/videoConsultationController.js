const consumeError = require("../functions/consumeError");
const models = require("../models");
const Profile = models.Profile;

const { generateAuthToken, createRoom } = require("../functions/100ms");

module.exports = {
  async getAuthToken(req, res) {
    try {
      const requestId = req.params.requestId;

      const profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
        },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      const role = profile.type === "fm-buyer" ? "participator" : "presenter";

      const token = await generateAuthToken(req.user, requestId, role);

      return { token };
    } catch (error) {
      consumeError(error);
    }
  },

  async createRoom(req, res) {
    try {
      const requestId = req.params.requestId;

      const profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
        },
      });

      if (!profile) {
        throw new Error("Profile not found");
      }

      const roomResponse = await createRoom(requestId);

      return true;
    } catch (error) {
      consumeError(error);
    }
  },
};
