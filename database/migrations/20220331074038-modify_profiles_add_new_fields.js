"use strict";

module.exports = {
  up(queryInterface, Sequelize) {
    return Promise.all([
      queryInterface.addColumn(
        "profiles", // table name
        "onboarded", // new field name
        {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        }
      ),
    ]);
  },
  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("profiles", "onboarded", {
          transaction: t,
        }),
      ]);
    });
  },
};
