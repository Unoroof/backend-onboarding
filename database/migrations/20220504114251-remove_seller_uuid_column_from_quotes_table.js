"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("quotes", "seller_uuid", {
          transaction: t,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("quotes", "seller_uuid", {
          transaction: t,
          type: Sequelize.STRING,
          allowNull: false,
        }),
      ]);
    });
  },
};
