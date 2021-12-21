const models = require("../models");
const Enquiries = models.Enquiries;
const consumeError = require("../functions/consumeError");

module.exports = {
    async create(req, res) {
        try {
            const enquiry = await Enquiries.create({
                user_uuid: req.user,
                type: req.body.type,
                data: req.body.data,
                status: "open"
            });
            return enquiry;
        }
        catch(error){
            consumeError(error);
        }
    }
}