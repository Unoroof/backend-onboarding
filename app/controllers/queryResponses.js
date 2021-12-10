const models = require("../models");
const QueryResponse = models.QueryResponse;
const AutoAssignCondition = models.AutoAssignConditions;
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
      return queryResponse;
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
      let queryResponse = await QueryResponse.findOne({
        where: {
          uuid: req.body.query_response_uuid,
        },
      });

      let payload = {
        assigned_uuid: req.body.assignee_profile_uuid,
      };
      if (req.body.query_response_remark) {
        queryResponse.data["remark"] = req.body.query_response_remark;
        payload.data = queryResponse.data;
      }

      queryResponse = await queryResponse.update(payload);

      return queryResponse;
    } catch (error) {
      consumeError(error);
    }
  },

  async unassigned(req, res) {
    try {
      let sellerProfile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-seller",
        },
      });

      let queryResponses = await QueryResponse.findAll({
        where: {
          owner_uuid: sellerProfile.uuid,
        },
      });

      let unassignedResponses = [];
      let buyersLeads = await getBuyersLeads(req.token, queryResponses);
      unassignedResponses = buyersLeads.wiredUpGeneratedLeads;

      if (buyersLeads.wiredUpGeneratedLeads.length > 0) {
        unassignedResponses = await buyersLeads.wiredUpGeneratedLeads.filter(
          (queryResponse) => {
            if (queryResponse.assigned_uuid === null) {
              return queryResponse;
            }
          }
        );
      }

      return unassignedResponses;
    } catch (error) {
      consumeError(error);
    }
  },
};
