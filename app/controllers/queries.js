const models = require("../models");
const Queries = models.Queries;
const Profile = models.Profile;
const QueryResponse = models.QueryResponse;
const consumeError = require("../functions/consumeError");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");

module.exports = {
  async index(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      let constraints = {
        where: {
          profile_uuid: profile.uuid,
        },
      };

      if (req.query.type) constraints.where.type = req.query.type;
      if (req.query.status) constraints.where.status = req.query.status;
      let queries = await Queries.findAll(constraints);
      return queries;
    } catch (error) {
      consumeError(error);
    }
  },

  async create(req, res) {
    try {
      let profile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      const query = await Queries.create({
        profile_uuid: profile.uuid,
        type: req.body.type,
        data: req.body.data,
        status: req.body.status,
        sellers: req.body.sellers,
      });

      if (query) {
        // console.log("check here query", query);
        // after creating query find eligible responders
        const eligibleResponders = await getEligibleResponders(
          req.token,
          query.sellers
        );
        console.log("check here eligibleResponders", eligibleResponders);

        // create empty row in query_response
        eligibleResponders.wired_up_users.forEach(async (item) => {
          await QueryResponse.create({
            profile_uuid: query.profile_uuid, //query creator
            query_uuid: query.uuid,
            status: "created",
            data: query.data,
            owner_uuid: item,
            assigned_uuid: item,
            // assigned_to_email: req.body.assigned_to_email,
            // assigned_to_mobile: req.body.assigned_to_mobile,
          });
        });

        // eligibleResponders.non_wired_up_users.forEach(async (item) => {
        //   await QueryResponse.create({
        //     profile_uuid: query.profile_uuid, //query creator
        //     query_uuid: query.uuid,
        //     status: "created",
        //     data: query.data,
        //     assigned_to_email: item.email,
        //     assigned_to_mobile: item.mobile,
        //   });
        // });
      }
      return query;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    console.log("queryuuid======", req.params.query_uuid);
    try {
      let query = await Queries.findOne({
        where: {
          uuid: req.params.query_uuid,
        },
      });

      query = await query.update({
        data: req.body.data ? { ...query.data, ...req.body.data } : query.data,
        status: req.body.status,
      });

      console.log("query=====", query);
      return query;
    } catch (error) {
      consumeError(error);
    }
  },
};

const getEligibleResponders = async (token, sellers) => {
  try {
    let eligibleResponders = {};
    let wired_up_users = [];
    // let non_wired_up_users = [];

    if (sellers.buyer_selected_sellers) {
      sellers.buyer_selected_sellers.forEach((item) => {
        // in buyer_selected_sellers we have profile_uuid's so we can push to eligibleResponders[wired_up_users]
        wired_up_users.push(item);
      });
    }

    if (sellers.system_selected_sellers) {
      let sellerProfiles = await findSystemSelectedSellers(
        sellers.system_selected_sellers
      );
      sellerProfiles.forEach((item) => {
        wired_up_users.push(item.uuid);
      });
    }

    if (sellers.addressbook_contacts) {
      let addressbookSellers = await findAddressbookSellers(
        token,
        sellers.addressbook_contacts
      );
      addressbookSellers.forEach((item) => {
        wired_up_users.push(item.uuid);
      });
    }

    eligibleResponders["wired_up_users"] = wired_up_users;
    // eligibleResponders["non_wired_up_users"] = non_wired_up_users;

    return eligibleResponders;
  } catch (error) {
    consumeError(error);
  }
};

const findSystemSelectedSellers = async (condition) => {
  try {
    let constraints = {
      where: {
        type: "fm-seller",
        "data.country.label": condition.country,
        "data.city.label": condition.city,
        // add turnover condition here too
      },
    };

    let profiles = await Profile.findAll(constraints);

    return profiles;
  } catch (error) {
    consumeError(error);
  }
};

const findAddressbookSellers = async (token, contacts) => {
  try {
    let userProfiles = [];
    contacts.forEach(async (item) => {
      let emailPayload = {
        email: item.email,
      };
      let mobilePayload = {
        mobile: item.mobile,
      };
      let userByEmail = await findUserByEmailMobile(token, emailPayload).catch(
        (e) => {
          console.log(e);
        }
      );

      console.log("check here uuid email123", userByEmail);
      if (userByEmail && userByEmail.user_uuid) {
        let sellerProfile = await Profile.findOne({
          where: {
            user_uuid: userByEmail.user_uuid,
            type: "fm-seller",
          },
        });
        userProfiles.push(sellerProfile.uuid);
      }

      let userByMobile = await findUserByEmailMobile(
        token,
        mobilePayload
      ).catch((e) => {
        console.log(e);
      });
      // .then((res) => {
      //   console.log("check here res mo", res);
      // })

      console.log("check here uuid mobile123", userByMobile);

      if (userByMobile && userByMobile.user_uuid) {
        let sellerProfile = await Profile.findOne({
          where: {
            user_uuid: userByMobile.user_uuid,
            type: "fm-seller",
          },
        });
        userProfiles.push(sellerProfile);
      }
    });

    return userProfiles;
  } catch (error) {
    consumeError(error);
  }
};
