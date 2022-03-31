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
};
