const models = require("../models");
const BillDiscountSuppliers = models.BillDiscountSuppliers;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");
const sendEvent = require("../functions/neptune/neptuneCaller");
const findUserByEmailMobile = require("../functions/findUserByEmailMobile");
const updateInvoicesArray = require("../functions/updateInvoicesArray");
const sendPushNotification = require("../functions/neptune/neptuneCaller");
const sendEventOnResponse = require("../functions/sendEventOnResponse");

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

      req.body.forEach(async (item) => {
        item.email = item.email.toLowerCase();
        item["buyer_company_name"] = profile.data.company_name;
        let payload = {};
        if (item.email) {
          payload["email"] = item.email;
        }

        if (item.phone_number) {
          payload["mobile"] = item.phone_number;
        }

        await findUserByEmailMobile(req.token, payload)
          .then(async (res) => {
            if (res.user_uuid) {
              let buyerProfile = await Profile.findOne({
                where: {
                  user_uuid: res.user_uuid,
                  type: "fm-buyer",
                },
              });

              if (buyerProfile) {
                item["profile_uuid"] = buyerProfile.uuid;
                item["company_name"] = buyerProfile.data.company_name;
              }
            }
          })
          .catch((e) => {
            console.log(e);
          });

        let supplier = await BillDiscountSuppliers.create({
          invited_by: profile.uuid,
          status: "pending",
          ...item,
        });

        if (supplier) {
          if (supplier.email) {
            await sendEvent({
              event_type: "buyer_sent_a_bill_discount_invitation",
              user_id: profile.user_uuid,
              data: {
                company_name: profile.data.company_name,
              },
              ignore_user_contacts: true,
              contact_infos: [
                {
                  type: "email",
                  value: supplier.email,
                },
              ],
            });
          } else if (supplier.phone_number) {
            const ph_number =
              supplier.phone_number.length === 13
                ? supplier.phone_number.substr(3)
                : supplier.phone_number.length === 12
                ? supplier.phone_number.substr(2)
                : supplier.phone_number.length === 11
                ? supplier.phone_number.substr(1)
                : supplier.phone_number;
            await sendEvent({
              event_type: "buyer_sent_a_bill_discount_invitation",
              user_id: profile.user_uuid,
              data: {
                company_name: profile.data.company_name.substr(0, 30),
              },
              ignore_user_contacts: true,
              contact_infos: [
                {
                  type: "mobile_number",
                  value: `+91${ph_number}`,
                },
              ],
            });
          }
        }
      });

      return "Invite Sent";
    } catch (error) {
      consumeError(error);
    }
  },

  /// api that we are using updating the invitation status.
  async update(req, res) {
    try {
      let bdSupplier = await BillDiscountSuppliers.findOne({
        where: {
          uuid: req.params.bd_supplier_uuid,
        },
      });

      console.log("bdSupplier details", bdSupplier);

      let payload = {};
      if (req.body.invoices) {
        payload["invoices"] = bdSupplier.invoices
          ? req.body.invoices
            ? updateInvoicesArray(bdSupplier.invoices, req.body.invoices)
            : bdSupplier.invoices
          : req.body.invoices;
      }

      if (req.body.status) {
        await sendEventOnResponse(req.body.status, bdSupplier);
        payload["status"] = req.body.status;
      }

      bdSupplier = await bdSupplier.update(payload);
      console.log("BD SUPPLIER DETAILS*****", bdSupplier.status);

      if (bdSupplier.status === "accepted") {
        await sendPushNotification({
          event_type: "bill_discounting_seller_accepts_the_invite",
          user_id: bdSupplier.invited_by,
          data: {
            name: bdSupplier.company_name,
            quote_type: "seller_accepted_bill_discounting_invite",
            notification_type: "seller_accepts_the_bd_invite",
          },
        });
      } else if (bdSupplier.status === "rejected") {
        await sendPushNotification({
          event_type: "bill_discounting_seller_rejects_the_invite",
          user_id: bdSupplier.invited_by,
          data: {
            name: bdSupplier.company_name,
            quote_type: "seller_rejected_bill_discounting_invite",
            notification_type: "seller_rejects_the_bd_invite",
          },
        });
      }
      return bdSupplier;
    } catch (error) {
      consumeError(error);
    }
  },
};
