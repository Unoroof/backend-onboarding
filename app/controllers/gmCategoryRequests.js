const consumeError = require("../functions/consumeError");
const GmCategoryRequests = require("../models").GmCategoryRequests;
const Profile = require("../models").Profile;
const sequelize = require("../models").sequelize;
const GmCategory = require("../models").GmCategory;

module.exports = {
  async store(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      const gmCategoryRequest = await GmCategoryRequests.create({
        category_name: req.body.name,
        created_by: profile.uuid,
        status: "pending",
      });
      return gmCategoryRequest;
    } catch (error) {
      consumeError(error);
    }
  },

  async index(req, res) {
    try {
      const categoryRequestsList = await GmCategoryRequests.findAll({
        where: {
          status: req.query.status || "pending",
        },
        attributes: {
          include: [
            [
              sequelize.literal(`(
                SELECT "profiles"."data" 
                FROM "profiles"
                WHERE "profiles"."uuid" = "GmCategoryRequests"."created_by"
                )`),
              "profile_data",
            ],
          ],
          exclude: ["createdAt", "updatedAt"],
        },
      });
      return categoryRequestsList;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let payload = {};
      let gmCategoryRequest = await GmCategoryRequests.findOne({
        where: {
          uuid: req.params.id,
        },
      });

      if (gmCategoryRequest.status === "accepted") {
        throw new Error("Already category accepted");
      }

      if (gmCategoryRequest.status === "rejected") {
        throw new Error("Already category rejected");
      }

      if (req.body.status) {
        payload["status"] = req.body.status;
      }

      gmCategoryRequest = await gmCategoryRequest.update(payload);

      const gmCategory = await GmCategory.findOne({
        where: {
          name: gmCategoryRequest.category_name,
        },
      });

      if (payload.status === "accepted" && !gmCategory) {
        await GmCategory.create({
          name: gmCategoryRequest.category_name,
        });
      }
      return gmCategoryRequest;
    } catch (error) {
      consumeError(error);
    }
  },
};
