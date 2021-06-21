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
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: req.body.type
        }
      });
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
          user_uuid: req.body.user_uuid || profile.user_uuid,
          type: req.body.type || profile.type,
          status: req.body.status || profile.status,
          data: req.body.data || profile.data,
        });
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

  async delete(req, res) {
    try {
      let profile = await Profile.findByPk(req.params.id);


      if (!profile) {
        consumeError({
          message: "Not Found..",
          code: 404,
        });
      }

      await profile.destroy();
      return {};
    } catch (error) {
      consumeError(error);
    }
  },
};

    // async show(req, res) {
    //     try {
    //         let profile = await Profile.findOne({
    //             where: {
    //                 user_uuid: req.user
    //             }
    //         });
    //         if (!profile) {
    // consumeError({
    //     message: "Not Found",
    //     code: 404,
    // });
    //         }
    //         return profile;
    //     } catch (error) {
    //         consumeError(error);
    //     }
    // },

    // async store(req, res) {
    //     try {
    //         let profile = await Profile.create({
    //             user_uuid: req.user,
    //             type: req.body.type,
    //             data: req.body.data,
    //             status: req.body.status,
    //         });
    //         return profile;
    //     } catch (error) {
    //         consumeError(error);
    //     }
    // },
