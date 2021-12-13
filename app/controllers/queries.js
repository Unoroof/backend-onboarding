const models = require("../models");
const Queries = models.Queries;
const Profile = models.Profile;
const QueryResponse = models.QueryResponse;
const consumeError = require("../functions/consumeError");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");
const { Op } = require("sequelize");
const autoAssign = require("../functions/autoAssign");

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
      let queries = await Queries.findAll({
        limit: req.query.limit || 100,
        ...constraints,
        order: [["createdAt", "DESC"]],
      });
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

      req.body.data["company_name"] = profile.data.company_name;
      req.body.data["buyer_full_name"] = profile.data.full_name;
      req.body.data["buyer_detail"] = {
        user_uuid: profile.user_uuid,
        email: profile.data.email,
        mobile: profile.data.mobile,
        full_name: profile.data.full_name,
        company_name: profile.data.company_name,
      };

      const query = await Queries.create({
        profile_uuid: profile.uuid,
        type: req.body.type,
        data: req.body.data,
        status: "open",
        sellers: req.body.sellers,
      });

      if (query) {
        // after creating query find eligible responders
        const eligibleResponders = await getEligibleResponders(
          req.token,
          query.sellers,
          query.data,
          profile
        );

        console.log(
          "QueriesEligibleResponders",
          JSON.stringify(eligibleResponders)
        );
        // create empty row in query_response
        eligibleResponders.wired_up_users.forEach(
          async (sellersProfileUuid) => {
            let queryResponse = await QueryResponse.create({
              profile_uuid: query.profile_uuid, // query creator
              query_uuid: query.uuid,
              status: "pending",
              data: query.data,
              owner_uuid: sellersProfileUuid,
              query_type: query.type,
            });

            console.log("QueriesQueryResponse", JSON.stringify(queryResponse));

            if (queryResponse) {
              console.log("AutoassignStartHere");
              await autoAssign(req.token, queryResponse);
            }
          }
        );
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

const getEligibleResponders = async (token, sellers, queryData, profile) => {
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
        queryData,
        profile
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

const findSystemSelectedSellers = async (condition, queryData, profile) => {
  try {
    let constraints = {
      where: {
        type: "fm-seller",
        "data.country.label": condition.country,
        "data.city.label": condition.city,
      },
    };
    if (queryData.type === "refinance_existing_loan") {
      constraints.where["data.currency_type.value"] =
        profile.data.currency_type.value;
      constraints.where["data.range.value"] = profile.data.range.value;

      // constraints.where["data.range.min_value"] = {
      //   [Op.lte]: parseInt(queryData.outstanding_loan_amount),
      // };

      // constraints.where["data.range.max_value"] = {
      //   [Op.gte]: parseInt(queryData.outstanding_loan_amount),
      // };
    }

    if (queryData.type === "corporate_finance_product") {
      constraints.where["data"] = {
        [Op.contains]: {
          offered_products: [queryData.product],
        },
      };
    }

    console.log("chck here constraints", constraints);

    let profiles = await Profile.findAll(constraints);
    console.log("check here profiles", profiles);
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
        let payload = {
          email: item.email,
          mobile: item.mobile,
        };

        await findUserByEmailMobile(token, payload)
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
        return userProfiles;
      })
    );
    console.log("check here userProfiles3", userProfiles);
    return userProfiles;
  } catch (error) {
    consumeError(error);
  }
};
