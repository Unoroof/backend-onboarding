const consumeError = require("../functions/consumeError");
const models = require("../models");
const Profile = models.Profile;
const ProfileRevision = models.ProfileRevision;
const { Op } = require("sequelize");

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
      if (req.body.city) constraints.where["data.city.label"] = req.body.city;
      if (req.body.currency)
        constraints.where["data.currency_type.label"] = req.body.currency;
      if (req.body.loan_amount) {
        constraints.where["data.range.min_value"] = {
          [Op.lte]: parseInt(req.body.loan_amount),
        };
        constraints.where["data.range.max_value"] = {
          [Op.gte]: parseInt(req.body.loan_amount),
        };
      }
      if (req.body.range)
        constraints.where["data.range.value"] = req.body.range;

      if (req.body.product)
        constraints.where["data"] = {
          [Op.contains]: {
            offered_products: [req.body.product],
          },
        };

      let profiles = await Profile.findAll(constraints);
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
};
