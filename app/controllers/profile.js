const consumeError = require("../functions/consumeError");
const models = require("../models");
const Profile = models.Profile;
const Queries = models.Queries;
const ProfileRevision = models.ProfileRevision;
const { Op } = require("sequelize");
const getBuyerUuidForProduct = require("../functions/getBuyerUuidForProduct");
const getProfileUuidByBankname = require("../functions/getProfileUuidByBankname");
const updateBillDiscountingSuppliers = require("../functions/updateBillDiscountingSuppliers");
const BillDiscountSuppliers = models.BillDiscountSuppliers;

module.exports = {
  async index(req, res) {
    try {
      let constraints = {
        where: {
          user_uuid: req.user,
        },
      };

      if (req.query.profile_uuid)
        constraints.where.uuid = req.query.profile_uuid;

      if (req.query.type) constraints.where.type = req.query.type;
      let profiles = await Profile.findAll(constraints);
      return profiles;
    } catch (error) {
      consumeError(error);
    }
  },

  async showById(req, res) {
    try {
      console.log("checvk here ", req.params.profile_uuid);
      let constraints = {
        where: {
          uuid: req.params.profile_uuid,
        },
      };

      let profile = await Profile.findAll(constraints);
      return profile;
    } catch (error) {
      consumeError(error);
    }
  },

  async getAllProfiles(req, res) {
    try {
      let constraints = {
        where: {},
      };

      if (req.body.type) constraints.where.type = req.body.type;
      if (req.body.country)
        constraints.where["data.country.label"] = req.body.country;
      // city: either it will be an array or a single value
      // array with array
      if (req.body.type === "fm-buyer") {
        if (req.body.city)
          constraints.where["data"] = {
            city: { label: req.body.city, value: req.body.city },
          };
      } else {
        if (req.body.city)
          constraints.where["data"] = {
            [Op.contains]: {
              city: [{ label: req.body.city, value: req.body.city }],
            },
          };
      }
      if (req.body.currency)
        constraints.where["data.currency_type.value"] = req.body.currency.value;

      if (req.body.range)
        constraints.where["data.range.value"] = req.body.range.value;

      if (req.body.product)
        constraints.where["data"] = {
          [Op.contains]: {
            offered_products: [req.body.product],
          },
        };

      if (req.body.product && req.body.city)
        constraints.where["data"] = {
          [Op.contains]: {
            offered_products: [req.body.product],
            city: [{ label: req.body.city, value: req.body.city }],
          },
        };

      if (req.body.user_uuid) constraints.where.user_uuid = req.body.user_uuid;

      let profiles = await Profile.findAll({
        ...constraints,
        order: [["createdAt", "DESC"]],
      });
      if (req.body.profilesForCompany) {
        profiles = await getProfileUuidByBankname(profiles);
      }
      return profiles;
    } catch (error) {
      consumeError(error);
    }
  },

  async storeOrUpdate(req, res) {
    try {
      // Check if Profile is Present
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: req.body.type,
        },
      });

      // if not profile, create it
      // toCreateRevision flag to check if revision is to be created
      let toCreateRevision = false;
      if (!profile) {
        profile = await Profile.create({
          user_uuid: req.user,
          type: req.body.type,
          data: req.body.data,
          status: req.body.status,
        });
        toCreateRevision = true;
        if (profile.type === "fm-buyer") {
          updateBillDiscountingSuppliers(profile);
        }
      } else {
        const prevData = profile.data;
        profile = await profile.update({
          type: req.body.type || profile.type,
          status: req.body.status || profile.status,
          onboarded: profile.status === "completed" ? true : profile.onboarded,
          data: req.body.data
            ? { ...prevData, ...req.body.data }
            : profile.data,
        });

        if (profile.type === "fm-buyer") {
          await updateBillDiscountingSuppliers(profile);
        }

        // Check if data is changed, then only create revision
        toCreateRevision =
          JSON.stringify(prevData) !== JSON.stringify(profile.data);
      }

      if (toCreateRevision) {
        await ProfileRevision.create({
          profile_uuid: profile.uuid,
          data: profile.data,
        });
      }

      return profile;
    } catch (error) {
      consumeError(error);
    }
  },

  async getBuyerForProduct(req, res) {
    try {
      let constraints = {
        where: {},
      };

      const profileUuids = await getBuyerUuidForProduct(req.query.product);

      if (req.query.product)
        constraints.where = {
          uuid: {
            [Op.in]: profileUuids,
          },
          data: {
            privacy_preference: true,
          },
        };

      let profiles = await Profile.findAll(constraints);
      return profiles;
    } catch (error) {
      consumeError(error);
    }
  },

  async updateVideoConsultationStatus(req, res) {
    try {
      const profile = await Profile.findOne({
        where: {
          uuid: req.params.profile_uuid,
          type: "fm-seller",
        },
      });

      if (profile) {
        const updateData = {
          video_consultation_enabled: req.body.enable,
        };

        if (!req.body.enable) {
          updateData.video_consultation_data = null;
        }

        return [await profile.update(updateData)];
      }

      throw new Error("Seller not found");
    } catch (error) {
      consumeError(error);
    }
  },

  async updateVideoConsultationData(req, res) {
    try {
      console.log("seller uuid", req.params.profile_uuid, req.params, req.body);
      const profile = await Profile.findOne({
        where: {
          uuid: req.params.profile_uuid,
          type: "fm-seller",
        },
      });

      if (profile) {
        return [
          await profile.update({
            video_consultation_enabled: true,
            video_consultation_data: {
              currency_type: req.body.currency_type,
              consultation_charge: req.body.consultation_charge,
              area_of_specifications: req.body.area_of_specifications,
              official_email_id: req.body.official_email_id,
              official_email_verified: req.body.official_email_verified,
            },
          }),
        ];
      }

      throw new Error("Seller not found");
    } catch (error) {
      consumeError(error);
    }
  },
};
