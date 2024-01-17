const models = require("../models");
const ContactsUsLeads = models.ContactsUsLeads;
const consumeError = require("../functions/consumeError");

module.exports = {
  async index(req, res) {
    try {
      let getAllContactLeads = await ContactsUsLeads.findAll({
        where: {},
      });
      return getAllContactLeads;
    } catch (error) {
      consumeError(error);
    }
  },
  async create(req, res) {
    try {
      const contactUsLead = await ContactsUsLeads.create({
        name: req.body.name,
        email: req.body.email,
        company_name: req.body.company_name,
        mobile_number: req.body.mobile_number,
        type: req.body?.type || "call_request",
        user_uuid: req.body?.user_uuid || null,
      });
      return contactUsLead;
    } catch (error) {
      consumeError(error);
    }
  },
};
