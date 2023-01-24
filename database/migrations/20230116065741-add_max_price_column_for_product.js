'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "gm_products", // table name
        "max_price", // new field name
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
        queryInterface.removeColumn("gm_products", "max_price", {
          transaction: t,
        }),
      ]);
    });
  }
};
