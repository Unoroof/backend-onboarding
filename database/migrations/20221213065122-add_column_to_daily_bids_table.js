"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "dailyBids", // table name
        "buyer_bids", // new field name
        {
          allowNull: true,
          type: Sequelize.JSONB,
        }
      ),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("dailyBids", "buyer_bids", {
          transaction: t,
        }),
      ]);
    });
  },
};
