const consumeError = require("../functions/consumeError");
const Profile = require("../models").Profile;
const ProfileRevision = require("../models").ProfileRevision;
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
            console.log(profiles);
            if (profiles == 0) res.status(404);
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
            if (!profile) {
                profile = await Profile.create({
                    user_uuid: req.user,
                    type: req.body.type,
                    data: req.body.data,
                    status: req.body.status,
                });
            }
            else {
                profile = await profile.update({
                    user_uuid: req.body.user_uuid || profile.user_uuid,
                    type: req.body.type || profile.type,
                    status: req.body.status || profile.status,
                    data: req.body.data || profile.data,
                });
            }
            let profileRevision = await ProfileRevision.create({
                profile_uuid: profile.uuid,
                data: profile.data
            })
            return profile;
        } catch (error) {
            consumeError(error);
        }
    },

    async delete(req, res) {
        try {
            let profile = await Profile.findByPk(req.params.id);

            console.log("delete", profile);

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
