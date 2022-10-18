"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "profiles", // table name
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
        queryInterface.removeColumn("profiles", "deletedAt", {
          transaction: t,
        }),
      ]);
    });
  },
};
