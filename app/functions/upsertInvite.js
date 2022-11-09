const models = require("../models");
const BillDiscountSuppliers = models.BillDiscountSuppliers;

module.exports = async (buyer_uuid, seller_profile_uuid, items) => {
  const foundInvite = await BillDiscountSuppliers.findOne({
    where: {
      invited_by: buyer_uuid,
      profile_uuid: seller_profile_uuid,
    },
  });

  const payloadForUpsertQuery = {
    invited_by: buyer_uuid,
    profile_uuid: seller_profile_uuid,
    status: "pending",
    ...items,
  };

  if (foundInvite) {
    payloadForUpsertQuery["uuid"] = foundInvite.dataValues.uuid;
  }

  //Upsert Invite using sequelize 6.0 >= functin upsert
  const [upsertResult, created] = await BillDiscountSuppliers.upsert(
    payloadForUpsertQuery
  );

  return upsertResult;
};
