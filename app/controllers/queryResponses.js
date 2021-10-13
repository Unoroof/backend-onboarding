const models = require("../models");
const QueryResponse = models.QueryResponse;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");
const { Op, Sequelize } = require("sequelize");
const getAddressbookContacts = require("../functions/getAddressbookContacts");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");

module.exports = {
  async index(req, res) {
    try {
      let constraints = {
        where: {},
      };

      if (req.query.uuid) constraints.where.owner_uuid = req.query.uuid;
      if (req.query.owner_uuid)
        constraints.where.owner_uuid = req.query.owner_uuid;
      if (req.query.assigned_uuid)
        constraints.where.assigned_uuid = req.query.assigned_uuid;
      if (req.query.query_uuid)
        constraints.where.query_uuid = req.query.query_uuid;
      if (req.query.status) constraints.where.status = req.query.status;
      if (req.query.profile_uuid)
        constraints.where.profile_uuid = req.query.profile_uuid;
      if (req.query.interval) {
        constraints.where.createdAt = {
          [Op.gt]: Sequelize.literal(
            `NOW() - INTERVAL '${req.query.interval} HOURS'`
          ),
        };
      }
      if (
        req.query.core_buyer_leads === "true" ||
        req.query.wirdeup_generated_leads === "true"
      ) {
        constraints.where.createdAt = {
          [Op.lt]: Sequelize.literal(`NOW() - INTERVAL '24 HOURS'`),
        };
      }

      console.log("check constraints", constraints);

      let queryResponses = await QueryResponse.findAll(constraints);

      if (
        req.query.core_buyer_leads === "true" ||
        req.query.wirdeup_generated_leads === "true"
      ) {
        if (queryResponses.length !== 0) {
          let buyersLeads = await getBuyersLeads(req.token, queryResponses);
          console.log("check here buyersLeads", buyersLeads);
          if (req.query.core_buyer_leads === "true") {
            return buyersLeads.coreBuyerLeads;
          } else if (req.query.wirdeup_generated_leads === "true") {
            return buyersLeads.wiredUpGeneratedLeads;
          }
        } else {
          return queryResponses;
        }
      } else {
        return queryResponses;
      }
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      console.log("check here response_uuid", req.params.response_uuid);
      let queryResponse = await QueryResponse.findOne({
        where: {
          uuid: req.params.response_uuid,
        },
      });

      let payload = {
        query_uuid: queryResponse.query_uuid,
        profile_uuid: queryResponse.profile_uuid,
      };

      if (req.body.status) {
        payload.status = req.body.status;
      }
      if (req.body.assigned_uuid) {
        payload.assigned_uuid = req.body.assigned_uuid;
      }
      if (req.body.data) {
        payload.data = req.body.data
          ? { ...queryResponse.data, ...req.body.data }
          : queryResponse.data;
      }

      queryResponse = await queryResponse.update(payload);
      return true;
    } catch (error) {
      consumeError(error);
    }
  },
};

const getBuyersLeads = async (token, queryResponses) => {
  try {
    const addressbookContacts = await getAddressbookContacts(token);

    let addressbookUserProfileUuids = await getAddressbookUserProfilUuids(
      token,
      addressbookContacts
    );

    console.log(
      "check here:addressbookUserProfileUuids:",
      addressbookUserProfileUuids
    );
    let coreBuyerLeads = [];

    await queryResponses.map(async (response) => {
      await addressbookUserProfileUuids.map((profileUuid) => {
        if (response.profile_uuid === profileUuid) {
          coreBuyerLeads.push(response);
        }
      });
    });

    console.log("check here coreBuyerLeads:", coreBuyerLeads);

    let wiredUpGeneratedLeads = await diffArray(queryResponses, coreBuyerLeads);

    console.log("check here wiredUpGeneratedLeads:", wiredUpGeneratedLeads);

    let buyers = {
      coreBuyerLeads: coreBuyerLeads,
      wiredUpGeneratedLeads: wiredUpGeneratedLeads,
    };

    return buyers;
  } catch (error) {
    consumeError(error);
  }
};

const getAddressbookUserProfilUuids = async (token, addressbookContacts) => {
  try {
    let addressbookUserProfileUuids = [];
    await Promise.all(
      await addressbookContacts.map(async (contact) => {
        if (contact.email) {
          let payload = {
            email: contact.email,
          };

          await findUserByEmailMobile(token, payload)
            .then(async (res) => {
              let buyerProfile = await Profile.findOne({
                where: {
                  user_uuid: res.user_uuid,
                  type: "fm-buyer",
                },
              });
              if (buyerProfile) {
                addressbookUserProfileUuids.push(buyerProfile.uuid);
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }

        if (contact.mobile) {
          let payload = {
            mobile: contact.mobile,
          };

          await findUserByEmailMobile(token, payload)
            .then(async (res) => {
              let buyerProfile = await Profile.findOne({
                where: {
                  user_uuid: res.user_uuid,
                  type: "fm-buyer",
                },
              });
              if (buyerProfile) {
                addressbookUserProfileUuids.push(buyerProfile.uuid);
              }
            })
            .catch((error) => {
              console.log("error", error);
            });
        }
      })
    );

    return addressbookUserProfileUuids;
  } catch (error) {
    consumeError(error);
  }
};

const diffArray = (arr1, arr2) => {
  return arr1
    .concat(arr2)
    .filter((item) => !arr1.includes(item) || !arr2.includes(item));
};
