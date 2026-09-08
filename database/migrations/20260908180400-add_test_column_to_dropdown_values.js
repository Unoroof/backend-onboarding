"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "dropdown_values",
        "test_column",
        {
          allowNull: true,
          type: Sequelize.STRING,
          defaultValue: null,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("dropdown_values", "test_column", {
          transaction: t,
        }),
      ]);
    });
  },
};
