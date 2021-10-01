const models = require("../models");
const Queries = models.Queries;
const Profile = models.Profile;
const QueryResponse = models.QueryResponse;
const consumeError = require("../functions/consumeError");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");
const { Op } = require("sequelize");

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
        // after creating query find eligible responders
        const eligibleResponders = await getEligibleResponders(
          req.token,
          query.sellers,
          query.data
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

const getEligibleResponders = async (token, sellers, queryData) => {
  try {
    let eligibleResponders = {};
    let wired_up_users = [];

    if (sellers.buyer_selected_sellers) {
      sellers.buyer_selected_sellers.forEach((item) => {
        // in buyer_selected_sellers we have profile_uuid's so we can push to eligibleResponders[wired_up_users]
        wired_up_users.push(item);
      });
    }

    if (sellers.system_selected_sellers) {
      let sellerProfiles = await findSystemSelectedSellers(
        sellers.system_selected_sellers,
        queryData
      );
      console.log("check here system selected seller", sellerProfiles);
      sellerProfiles.forEach((item) => {
        wired_up_users.push(item.uuid);
      });
    }

    if (sellers.addressbook_contacts) {
      let addressbookSellers = await findAddressbookSellers(
        token,
        sellers.addressbook_contacts
      );
      console.log("check here addressbook", addressbookSellers);
      addressbookSellers.forEach((item) => {
        wired_up_users.push(item);
      });
    }

    eligibleResponders["wired_up_users"] = wired_up_users;

    return eligibleResponders;
  } catch (error) {
    consumeError(error);
  }
};

const findSystemSelectedSellers = async (condition, queryData) => {
  try {
    let constraints = {
      where: {
        type: "fm-seller",
        "data.country.label": condition.country,
        "data.city.label": condition.city,
        "data.currency_type.label":
          queryData.initial.refinance_details.loan_currency.label,
        "data.range.min_value": {
          [Op.lte]: queryData.initial.refinance_details.outstanding_loan_amount,
        },
        "data.range.max_value": {
          [Op.gte]: queryData.initial.refinance_details.outstanding_loan_amount,
        },
      },
    };

    console.log("chck here constraints", constraints);

    let profiles = await Profile.findAll(constraints);

    return profiles;
  } catch (error) {
    consumeError(error);
  }
};

const findAddressbookSellers = async (token, contacts) => {
  try {
    let userProfiles = [];
    await Promise.all(
      await contacts.map(async (item) => {
        let emailPayload = {
          email: item.email,
        };
        let mobilePayload = {
          mobile: item.mobile,
        };

        await findUserByEmailMobile(token, emailPayload)
          .then(async (res) => {
            if (res.user_uuid) {
              let sellerProfile = await Profile.findOne({
                where: {
                  user_uuid: res.user_uuid,
                  type: "fm-seller",
                },
              });

              userProfiles.push(sellerProfile.uuid);
            }
          })
          .catch((e) => {
            console.log(e);
          });
        console.log("check here userProfiles", userProfiles);

        await findUserByEmailMobile(token, mobilePayload)
          .then(async (res) => {
            if (res.user_uuid) {
              let sellerProfile = await Profile.findOne({
                where: {
                  user_uuid: res.user_uuid,
                  type: "fm-seller",
                },
              });
              userProfiles.push(sellerProfile.uuid);
            }
          })
          .catch((e) => {
            console.log(e);
          });
        console.log("check here userProfiles2", userProfiles);
        return userProfiles;
      })
    );
    console.log("check here userProfiles3", userProfiles);
    return userProfiles;
  } catch (error) {
    consumeError(error);
  }
};
