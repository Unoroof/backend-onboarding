const { Op } = require("sequelize");
const models = require("../models");
const BillDiscountSuppliers = models.BillDiscountSuppliers;

module.exports = async function updateBillDiscountSuppliers(profile) {
  try {
    let bdSuppliers = await BillDiscountSuppliers.findAll({
      where: {
        [Op.or]: [
          {
            email: profile.data.email !== "" ? profile.data.email : null,
          },
          {
            phone_number:
              profile.data.mobile !== "" ? profile.data.mobile : null,
          },
        ],
      },
      attributes: ["uuid"],
    });
    let uuidsToUpdate = [];

    bdSuppliers.forEach(async (item) => {
      uuidsToUpdate.push(item.uuid);
    });

    BillDiscountSuppliers.update(
      {
        profile_uuid: profile.uuid,
        company_name: profile.data.company_name
          ? profile.data.company_name
          : "",
      },
      {
        where: {
          uuid: {
            [Op.in]: uuidsToUpdate,
          },
        },
      }
    );
  } catch (error) {
    console.log("Error While Updating bill discounting suppliers>>>", error);
  }
};
