"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "billDiscountSuppliers",
          "buyer_company_name",
          {
            transaction: t,
            type: Sequelize.STRING,
          }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          "billDiscountSuppliers",
          "buyer_company_name",
          {
            transaction: t,
            type: Sequelize.STRING,
          }
        ),
      ]);
    });
  },
};
