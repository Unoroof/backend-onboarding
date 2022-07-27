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
        if (item.email) {
          item.email = item.email.toLowerCase();
        }
        if (item.phone_number && item.phone_number !== "") {
          item.phone_number = item.isd_code.value + item.phone_number;
        }
        delete item["isd_code"];
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
            console.log("SUPPLIER UUID CHECK", profile.user_uuid);

            console.log("SUPPLIER information in inviet", supplier);

            let sellerProfileData = await Profile.findOne({
              where: {
                uuid: supplier.profile_uuid,
                type: "fm-buyer",
              },
            });
            console.log("SELLER PROFILE DATA", sellerProfileData);
            await sendPushNotification({
              event_type: "buyer_invited_supplier",
              user_id: sellerProfileData.user_uuid,
              data: {
                quote_type: "bill_discouting",
                name: profile.data.company_name,
                notification_type: "buyer_invited_supplier",
              },
            });
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
            let sellerProfileData = await Profile.findOne({
              where: {
                uuid: supplier.profile_uuid,
                type: "fm-buyer",
              },
            });
            await sendPushNotification({
              event_type: "buyer_invited_supplier",
              user_id: sellerProfileData.user_uuid,
              data: {
                quote_type: "bill_discouting",
                name: profile.data.company_name,
                notification_type: "buyer_invited_supplier",
              },
            });
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
                  value: supplier.phone_number,
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

      let buyerProfileData = await Profile.findOne(
        {
          where: {
            uuid: bdSupplier.invited_by,
            type: "fm-buyer",
          },
        }
        // { transaction: t }
      );

      console.log("Buyer pROFILE IN SUPPLIERS FILE", buyerProfileData);

      if (bdSupplier.status === "accepted") {
        await sendPushNotification({
          event_type: "bd_seller_accepts_the_invite",
          user_id: buyerProfileData.user_uuid,
          data: {
            name: bdSupplier.company_name,
            quote_type: "bill discounting",
            notification_type: "bd_seller_accepts_the_invite",
          },
        });
      } else if (bdSupplier.status === "rejected") {
        await sendPushNotification({
          event_type: "bd_supplier_rejects_the_invite",
          user_id: buyerProfileData.user_uuid,
          data: {
            name: bdSupplier.company_name,
            quote_type: "bill discounting",
            notification_type: "bd_supplier_rejects_the_invite",
          },
        });
      }
      return bdSupplier;
    } catch (error) {
      consumeError(error);
    }
  },
};
