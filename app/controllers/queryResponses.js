const models = require("../models");
const QueryResponse = models.QueryResponse;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");
const { Op, Sequelize } = require("sequelize");
const getBuyersLeads = require("../functions/getBuyersLeads");
const getAddressbookUsersProfile = require("../functions/getAddressbookUsersProfile");

module.exports = {
  async index(req, res) {
    try {
      let constraints = {
        where: {},
      };

      if (req.query.uuid) constraints.where.uuid = req.query.uuid;
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

  async autoReject(req, res) {
    try {
      let data = [];
      await Promise.all(
        await req.body.queryResponses.map(async (response) => {
          let queryResponse = await QueryResponse.findOne({
            where: {
              uuid: response.uuid,
            },
          });
          let payload = {
            status: "rejected",
          };
          queryResponse = await queryResponse.update(payload);
          data.push(queryResponse);
        })
      );
      return data;
    } catch (error) {
      consumeError(error);
    }
  },

  async reAssign(req, res) {
    try {
      let type = "fm-seller";

      let sellerProfile = await getAddressbookUsersProfile(
        req.token,
        [req.body.seller],
        type
      );

      let queryResponse = await QueryResponse.findOne({
        where: {
          uuid: req.body.query_response_uuid,
        },
      });

      queryResponse = await queryResponse.update({
        assigned_uuid: sellerProfile[0].uuid,
      });

      return queryResponse;
    } catch (error) {
      consumeError(error);
    }
  },
};
