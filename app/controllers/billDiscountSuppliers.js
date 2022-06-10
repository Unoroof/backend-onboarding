const models = require("../models");
const BillDiscountSuppliers = models.BillDiscountSuppliers;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");

module.exports = {
  async index(req, res) {
    try {
      let bdSupplier = await BillDiscountSuppliers.findOne({
        where: {
          uuid: req.params.bd_supplier_uuid,
        },
      });
      return bdSupplier;
    } catch (error) {
      consumeError(error);
    }
  },

  async getAll(req, res) {
    try {
      let constraints = {
        where: {},
      };

      if (req.query.invited_by)
        constraints.where.invited_by = req.query.invited_by;
      if (req.query.status) constraints.where.status = req.query.status;
      if (req.query.gm_seller)
        constraints.where.profile_uuid = req.query.gm_seller;

      let bdSuppliers = await BillDiscountSuppliers.findAll({
        ...constraints,
        order: [["createdAt", "DESC"]],
      });
      return bdSuppliers;
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

      let payload = {
        invited_by: profile.uuid,
        status: "pending",
      };

      if (req.body.company_name) {
        payload["company_name"] = req.body.company_name;
      }

      if (req.body.email) {
        payload["email"] = req.body.email;
      }

      if (req.body.phone_number) {
        payload["phone_number"] = req.body.phone_number;
      }

      const supplier = await BillDiscountSuppliers.create(payload);

      if (supplier) {
        // send email/sms
        //    await sendPushNotification({
        //      event_type: "buyer_sent_a_bill_discount_invitation",
        //      user_id: profile.user_uuid,
        //      data: {
        //        company_name:profile.data.company_name
        //      },
        //    });
      }

      return supplier;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let bdSupplier = await BillDiscountSuppliers.findOne({
        where: {
          uuid: req.params.bd_supplier_uuid,
        },
      });

      let payload = {};
      if (req.body.invoices) {
        payload["invoices"] = bdSupplier.invoices
          ? req.body.invoices
            ? [...bdSupplier.invoices, ...req.body.invoices]
            : bdSupplier.invoices
          : req.body.invoices;
      }

      if (req.body.status) {
        payload["status"] = req.body.status;
      }

      bdSupplier = await bdSupplier.update(payload);
      return bdSupplier;
    } catch (error) {
      consumeError(error);
    }
  },
};
