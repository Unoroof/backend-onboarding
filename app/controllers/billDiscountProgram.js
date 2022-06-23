const models = require("../models");
const BillDiscountProgram = models.BillDiscountProgram;
const Profile = models.Profile;
const DailyBids = models.DailyBids;
const consumeError = require("../functions/consumeError");
const updateInvoicesArray = require("../functions/updateInvoicesArray");

const { Op } = require("sequelize");

module.exports = {
  async index(req, res) {
    try {
      let billDiscountProgram = await BillDiscountProgram.findOne({
        where: {
          uuid: req.params.bill_discount_program_uuid,
        },
      });
      return billDiscountProgram;
    } catch (error) {
      consumeError(error);
    }
  },

  async getAll(req, res) {
    try {
      let constraints = {
        where: {},
      };

      if (req.query.request_by)
        constraints.where.request_by = req.query.request_by;

      if (req.query.request_to)
        constraints.where.request_to = req.query.request_to;

      if (req.query.status) constraints.where.status = req.query.status;

      let billDiscountProgram = await BillDiscountProgram.findAll({
        ...constraints,
        order: [["createdAt", "DESC"]],
      });
      return billDiscountProgram;
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

      let dailyBids = await DailyBids.findOne({
        where: {
          uuid: req.body.daily_bids_uuid,
        },
      });

      let payload = {
        daily_bids_uuid: req.body.daily_bids_uuid,
        request_by: profile.uuid,
        request_to: dailyBids.profile_uuid,
        data: req.body.data,
      };

      let billDiscountProgram = await BillDiscountProgram.create(payload);

      return billDiscountProgram;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let billDiscountProgram = await BillDiscountProgram.findOne({
        where: {
          uuid: req.params.bill_discount_program_uuid,
        },
      });

      let payload = {};
      if (req.body.invoices) {
        payload["invoices"] = billDiscountProgram.invoices
          ? req.body.invoices
            ? updateInvoicesArray(
                billDiscountProgram.invoices,
                req.body.invoices
              )
            : billDiscountProgram.invoices
          : req.body.invoices;
      }

      if (req.body.data) {
        payload["data"] = { ...billDiscountProgram.data, ...req.body.data };
      }

      if (req.body.status) {
        payload["status"] = req.body.status;
      }

      billDiscountProgram = await billDiscountProgram.update(payload);
      return billDiscountProgram;
    } catch (error) {
      consumeError(error);
    }
  },
};
