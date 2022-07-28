const models = require("../models");
const BillDiscountProgram = models.BillDiscountProgram;
const Profile = models.Profile;
const DailyBids = models.DailyBids;
const consumeError = require("../functions/consumeError");
const updateInvoicesArray = require("../functions/updateInvoicesArray");
const sendPushNotification = require("../functions/neptune/neptuneCaller");
const sendEventOnResponse = require("../functions/sendEventOnResponse");

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

      let profileOfDailyBids = await Profile.findOne({
        where: {
          uuid: dailyBids.profile_uuid,
        },
      });

      let data = req.body.data ? req.body.data : {};
      data["request_by_company_name"] = profile.data.company_name
        ? profile.data.company_name
        : "";
      data["request_to_company_name"] = profileOfDailyBids.data.company_name
        ? profileOfDailyBids.data.company_name
        : "";

      let payload = {
        daily_bids_uuid: req.body.daily_bids_uuid,
        request_by: profile.uuid,
        request_to: dailyBids.profile_uuid,
        data: data,
        status: req.body.status,
      };

      // dailyBids
      let alreadyExistValue = await BillDiscountProgram.findOne({
        where: {
          daily_bids_uuid: req.body.daily_bids_uuid,
          data: {
            joined_program: {
              tenor: data.joined_program.tenor,
              discount: data.joined_program.discount,
            },
          },
        },
      });

      if (!alreadyExistValue) {
        let billDiscountProgram = await BillDiscountProgram.create(payload);

        let sellerProfileData = await Profile.findOne({
          where: {
            uuid: billDiscountProgram.request_to,
            type: "fm-buyer",
          },
        });

        console.log(
          "SELLER PROFILE DATA CHECK IN BILL DISCOUNTING",
          sellerProfileData
        );

        if (billDiscountProgram.status === "accepted") {
          await sendPushNotification({
            event_type: "bd_buyer_accepts_the_quote",
            user_id: sellerProfileData.user_uuid,
            data: {
              name: billDiscountProgram.data.request_to_company_name,
              query_type: "bill discounting",
              notification_type: "bd_buyer_accepts_the_quote",
            },
          });
        }

        if (billDiscountProgram.status === "rejected") {
          await sendPushNotification({
            event_type: "bd_buyer_rejects_the_discount",
            user_id: sellerProfileData.user_uuid,
            data: {
              name: billDiscountProgram.data.request_to_company_name,
              query_type: "bill discounting",
              notification_type: "bd_buyer_rejects_the_discount",
            },
          });
        }

        return billDiscountProgram;
      } else {
        return "Already accepted";
      }
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
        await sendEventOnResponse(req.body.status, billDiscountProgram);
      }

      billDiscountProgram = await billDiscountProgram.update(payload);
      console.log("BILL DISCOUNTING PROGRAM", billDiscountProgram);
      if (
        billDiscountProgram.status === "accepted" &&
        billDiscountProgram.invoices.length > 0
      ) {
        let buyerProfile = await Profile.findOne({
          where: {
            uuid: billDiscountProgram.request_to,
          },
        });

        // let anotherBuyer = await Profile.findOne({
        //   where: {
        //     uuid: billDiscountProgram.request_by,
        //   },
        // });

        // console.log(
        //   "Buyer profile IN BILL DISCOUNTING GGNJKKDFHHGDFJHDJFFG",
        //   buyerProfile
        // );

        // console.log(
        //   "Another Buyer profile IN BILL DISCOUNTING GGNJKKDFHHGDFJHDJFFG",
        //   anotherBuyer
        // );
        await sendPushNotification({
          event_type: "bd_seller_uploaded_invoices",
          user_id: buyerProfile.user_uuid,
          data: {
            name: billDiscountProgram.data.request_by_company_name,
            query_type: "seller_has_uploaded_invoices",
            query_status: billDiscountProgram.status,
            quote_uuid: billDiscountProgram.daily_bids_uuid,
            ...billDiscountProgram.data,
            notification_type: "bd_seller_uploaded_invoices",
          },
        });
      }
      return billDiscountProgram;
    } catch (error) {
      consumeError(error);
    }
  },

  async calculateChart(req, res) {
    // pie chart calculation...
  },
};
