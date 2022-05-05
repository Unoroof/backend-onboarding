"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("quote_responses", "owner_uuid", {
          transaction: t,
          type: Sequelize.UUID,
          allowNull: true,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("quote_responses", "owner_uuid", {
          transaction: t,
          type: Sequelize.UUID,
          allowNull: true,
        }),
      ]);
    });
  },
};
