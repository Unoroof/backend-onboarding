const models = require("../models");
const Queries = models.Queries;
const Profile = models.Profile;
const QueryResponse = models.QueryResponse;
const consumeError = require("../functions/consumeError");

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
        console.log("check here query", query);
        // after creating query find eligible responders
        const eligibleResponders = await getEligibleResponders(query.sellers);
        console.log("check here eligibleResponders", eligibleResponders);

        // create empty row in query_response
        eligibleResponders.wired_up_users.forEach(async (item) => {
          let sellerProfile = await Profile.findOne({
            where: {
              user_uuid: item,
              type: "fm-seller",
            },
          });
          await QueryResponse.create({
            profile_uuid: query.profile_uuid, //query creator
            query_uuid: query.uuid,
            status: "created",
            data: query.data,
            owner_uuid: sellerProfile.uuid,
            assigned_uuid: sellerProfile.uuid,
            // assigned_to_email: req.body.assigned_to_email,
            // assigned_to_mobile: req.body.assigned_to_mobile,
          });
        });

        eligibleResponders.non_wired_up_users.forEach(async (item) => {
          await QueryResponse.create({
            profile_uuid: query.profile_uuid, //query creator
            query_uuid: query.uuid,
            status: "created",
            data: query.data,
            assigned_to_email: item.email,
            assigned_to_mobile: item.mobile,
          });
        });
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

const getEligibleResponders = (sellers) => {
  try {
    let eligibleResponders = {};
    let wired_up_users = [];
    let non_wired_up_users = [];

    sellers.buyer_selected_sellers.forEach((item) => {
      // in buyer_selected_sellers we have uuid's so we can push to tempSellers[wired_up_users]
      wired_up_users.push(item);
    });

    sellers.system_selected_sellers.forEach((item) => {
      // in buyer_selected_sellers we have uuid's so we can push to tempSellers[wired_up_users]
      wired_up_users.push(item);
    });

    sellers.addressbook_contacts.forEach((item) => {
      // in addressbooks contact some contact will be wiredup users and some won't
      if (item.mobile && item.email) {
        non_wired_up_users.push(item);
      } else {
        wired_up_users.push(item);
      }
    });

    eligibleResponders["wired_up_users"] = wired_up_users;
    eligibleResponders["non_wired_up_users"] = non_wired_up_users;

    return eligibleResponders;
  } catch (error) {
    consumeError(error);
  }
};
