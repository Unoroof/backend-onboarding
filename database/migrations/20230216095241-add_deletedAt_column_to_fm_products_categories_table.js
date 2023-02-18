"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "fm_products_categories", // table name
        "deletedAt", // new field name
        {
          allowNull: true,
          type: Sequelize.DATE,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("fm_products_categories", "deletedAt", {
          transaction: t,
        }),
      ]);
    });
  },
};
