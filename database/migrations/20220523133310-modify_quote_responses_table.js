"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "quote_responses",
          "seller_payment_status",
          { type: Sequelize.STRING },
          { transaction: t }
        ),
        queryInterface.addColumn(
          "quote_responses",
          "buyer_payment_status",
          { type: Sequelize.STRING },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          "quote_responses",
          "seller_payment_status",
          {
            transaction: t,
          }
        ),
        queryInterface.removeColumn("quote_responses", "buyer_payment_status", {
          transaction: t,
        }),
      ]);
    });
  },
};
