const models = require("../models");
const Address = models.Address;
const consumeError = require("../functions/consumeError");
const sequelize = require("../models").sequelize;

module.exports = {
  async index(req) {
    try {
      let constraints = {
        where: {},
      };

      if (req.query.uuid) constraints.where.uuid = req.query.uuid;
      if (req.query.profile_uuid)
        constraints.where.profile_uuid = req.query.profile_uuid;

      let result = sequelize.transaction(async (t) => {
        let quoteResponses = await Address.findAll(constraints, {
          transaction: t,
        });
        return quoteResponses;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },

  async create(req) {
    try {
      let result = sequelize.transaction(async (t) => {
        let isAlreadyExistedAddress = await Address.findOne(
          {
            where: {
              profile_uuid: req.body.profile_uuid,
              location_name: req.body.location_name,
            },
          },
          { transaction: t }
        );

        if (isAlreadyExistedAddress) {
          throw new Error("Location name should be unique");
        }

        let address = await Address.create(req.body, { transaction: t });

        return address;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req) {
    try {
      let payload = { ...req.body };
      let result = sequelize.transaction(async (t) => {
        let address = await Address.findOne(
          {
            where: {
              uuid: req.params.uuid,
            },
          },
          { transaction: t }
        );

        if (!address) {
          throw new Error("Address not found");
        }

        if (req.body.data) {
          payload.data = req.body.data
            ? { ...address.data, ...req.body.data }
            : address.data;
        }

        address = await address.update(payload, { transaction: t });

        return address;
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },

  async delete(req) {
    try {
      let result = sequelize.transaction(async (t) => {
        let address = await Address.findOne(
          {
            where: {
              uuid: req.params.uuid,
            },
          },
          { transaction: t }
        );

        if (!address) {
          throw new Error("Address not found");
        }

        const deletedAddress = await address.destroy();

        if (deletedAddress) {
          return { message: "Address deleted successfully" };
        }
      });
      return result;
    } catch (error) {
      consumeError(error);
    }
  },
};
