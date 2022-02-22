const consumeError = require("../functions/consumeError");
const models = require("../models");
const Profile = models.Profile;
const Queries = models.Queries;
const ProfileRevision = models.ProfileRevision;
const { Op } = require("sequelize");
const getBuyerUuidForProduct = require("../functions/getBuyerUuidForProduct");

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
      if (req.body.city)
        constraints.where["data"] = {
          [Op.contains]: {
            city: req.body.city.length
              ? req.body.city
              : [
                  typeof req.body.city === "string"
                    ? { label: req.body.city, value: req.body.city }
                    : req.body.city,
                ],
          },
        };
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

      if (req.body.user_uuid) constraints.where.user_uuid = req.body.user_uuid;

      let profiles = await Profile.findAll({
        ...constraints,
        order: [["createdAt", "DESC"]],
      });
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
      } else {
        const prevData = profile.data;
        profile = await profile.update({
          type: req.body.type || profile.type,
          status: req.body.status || profile.status,
          data: req.body.data
            ? { ...prevData, ...req.body.data }
            : profile.data,
        });
        // Check if data is changed, then only create revision
        toCreateRevision =
          JSON.stringify(prevData) !== JSON.stringify(profile.data);
      }

      if (toCreateRevision) {
        console.log("Creating New Revision");
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
            privacy_preference: false,
          },
        };

      let profiles = await Profile.findAll(constraints);
      return profiles;
    } catch (error) {
      consumeError(error);
    }
  },

  async updateCity(req, res) {
    try {
      let constraints = {
        where: {
          type: req.body.type,
        },
      };
      let profiles = await Profile.findAll(constraints);

      profiles.forEach(async (item) => {
        if (item.data.city && !item.data.city.length) {
          let profile = await Profile.findOne({
            where: {
              user_uuid: item.user_uuid,
              type: item.type,
            },
          });
          item.data.city = [item.data.city];
          await profile.update({
            data: item.data,
          });
        }
      });
      return profiles;
    } catch (error) {
      consumeError(error);
    }
  },
};
