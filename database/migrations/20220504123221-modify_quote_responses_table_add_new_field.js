"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn("quote_responses", "quote_type", {
          transaction: t,
          type: Sequelize.STRING,
        }),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("quote_responses", "quote_type", {
          transaction: t,
        }),
      ]);
    });
  },
};
