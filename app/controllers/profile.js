const consumeError = require("../functions/consumeError");
const models = require("../models");
const Profile = models.Profile;
const ProfileRevision = models.ProfileRevision;
module.exports = {
  async index(req, res) {
    try {
      let constraints = {
        where: {
          user_uuid: req.user,
        }
      };
      if (req.query.type) constraints.where.type = req.query.type;
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
          type: req.body.type
        }
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
      }
      else {
        const prevData = profile.data;
        profile = await profile.update({
          type: req.body.type || profile.type,
          status: req.body.status || profile.status,
          data: req.body.data ? { ...prevData, ...req.body.data } : profile.data,
        });
        // Check if data is changed, then only create revision
        toCreateRevision = JSON.stringify(prevData) !== JSON.stringify(profile.data);
      }


      if (toCreateRevision) {
        console.log('Creating New Revision');
        await ProfileRevision.create({
          profile_uuid: profile.uuid,
          data: profile.data
        })
      }
      return profile;
    } catch (error) {
      consumeError(error);
    }
  },
};
