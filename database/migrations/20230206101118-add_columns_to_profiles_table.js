"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "profiles", // table name
        "video_consultation_enabled", // new field name
        {
          allowNull: true,
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        }
      ),
      queryInterface.addColumn(
        "profiles", // table name
        "video_consultation_data", // new field name
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
        queryInterface.removeColumn("profiles", "video_consultation_enabled", {
          transaction: t,
        }),
        queryInterface.removeColumn("profiles", "video_consultation_data", {
          transaction: t,
        }),
      ]);
    });
  },
};
