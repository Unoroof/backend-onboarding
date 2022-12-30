const consumeError = require("../functions/consumeError");
const GmCategoryRequests = require("../models").GmCategoryRequests;
const Profile = require("../models").Profile;
const sequelize = require("../models").sequelize;
const GmCategory = require("../models").GmCategory;
const sendEmailNotification = require("../functions/neptune/neptuneCaller");

const adminEmailContacts = [
  {
    type: "email",
    value: "sonali@unoroof.in",
  },
  {
    type: "email",
    value: "manasa@betalectic.com",
  },
  // {
  //   type: "email",
  //   value: "subrahmanyam@betalectic.com",
  // },
];

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

      if (gmCategoryRequest) {
        await sendEmailNotification({
          event_type: "user_added_category_request",
          user_id: profile.data.user_uuid,
          data: {
            name: profile.data.full_name,
            category_name: req.body.name,
            email: profile.data.email,
            mobile: profile.data.mobile,
          },
          ignore_user_contacts: true,
          contact_infos: adminEmailContacts,
        });
      }

      return gmCategoryRequest;
    } catch (error) {
      consumeError(error);
    }
  },

  async index(req, res) {
    try {
      let where = {};
      if (req.query.status) {
        where.status = req.query.status;
      }

      const categoryRequestsList = await GmCategoryRequests.findAll({
        where: where,
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

      const gmSellerProfile = await Profile.findOne({
        where: {
          uuid: gmCategoryRequest.created_by,
        },
      });

      if (gmSellerProfile) {
        await sendEmailNotification({
          event_type:
            gmCategoryRequest.status === "accepted"
              ? "admin_approves_category_request"
              : "admin_rejects_category_request",
          user_id: req.user,
          data: {
            name: gmSellerProfile.data.full_name,
            category_name: gmCategoryRequest.category_name,
          },
          ignore_user_contacts: true,
          contact_infos: [
            {
              type: "email",
              value: gmSellerProfile.data.email,
            },
            ...adminEmailContacts.map((item) => {
              return {
                ...item,
                cc: true,
              };
            }),
          ],
        });
      }

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
