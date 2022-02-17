const models = require("../models");
const Enquiries = models.Enquiries;
const Profile = models.Profile;
const consumeError = require("../functions/consumeError");
const sendEmail = require("../functions/sendEmail");

module.exports = {
  async create(req, res) {
    try {
      const enquiry = await Enquiries.create({
        user_uuid: req.user,
        type: req.body.type,
        data: req.body.data,
        status: "open",
      });
      return enquiry;
    } catch (error) {
      consumeError(error);
    }
  },

  async update(req, res) {
    try {
      let buyerProfile = await Profile.findOne({
        where: {
          user_uuid: req.user,
          type: "fm-buyer",
        },
      });

      let enquiry = await Enquiries.findOne({
        where: {
          uuid: req.params.enquiry_uuid,
        },
      });

      console.log("query", enquiry);

      enquiry = await enquiry.update({
        data: req.body.data
          ? { ...enquiry.data, ...req.body.data }
          : enquiry.data,
        status: req.body.status ? req.body.status : enquiry.status,
        payment_status: req.body.payment_status
          ? req.body.payment_status
          : enquiry.payment_status,
      });

      if (req.body.payment_status === "paid") {
        await sendEmail(enquiry, buyerProfile);
      }

      return enquiry;
    } catch (error) {
      consumeError(error);
    }
  },
};
