"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("quote_responses", "seller_uuid", {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("quote_responses", "seller_uuid", {
          transaction: t,
          type: Sequelize.STRING,
          allowNull: false,
        }),
      ]);
    });
  },
};
