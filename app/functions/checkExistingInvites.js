const models = require("../models");
const BillDiscountSuppliers = models.BillDiscountSuppliers;
const { Op } = require("sequelize");

module.exports = async (buyer_uuid, seller_profile_uuid) => {
  let foundInvite = await BillDiscountSuppliers.findOne({
    where: {
      invited_by: buyer_uuid,
      profile_uuid: seller_profile_uuid,
      status: {
        [Op.ne]: "rejected",
      },
    },
  });
  if (foundInvite) {
    return [true, foundInvite.dataValues.status];
  }
  return [false, "----"];
};
