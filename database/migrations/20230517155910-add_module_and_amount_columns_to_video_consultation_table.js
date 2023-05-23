"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn(
        "video_consultations", // table name
        "module", // new field name
        {
          allowNull: false,
          type: Sequelize.STRING,
          defaultValue: "video_consultation",
        }
      ),

      await queryInterface.addColumn(
        "video_consultations", // table name
        "amount", // new field name
        {
          allowNull: true,
          type: Sequelize.INTEGER,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("video_consultations", "module", {
          transaction: t,
        }),
        queryInterface.removeColumn("video_consultations", "amount", {
          transaction: t,
        }),
      ]);
    });
  },
};
