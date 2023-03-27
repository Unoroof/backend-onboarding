"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.addColumn(
        "video_consultations",
        "video_session_data",
        {
          allowNull: true,
          type: Sequelize.JSONB,
        }
      ),

      await queryInterface.addColumn("video_consultations", "expiry_reason", {
        allowNull: true,
        type: Sequelize.STRING,
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      return Promise.all([
        await queryInterface.removeColumn(
          "video_consultations",
          "video_session_data",
          {
            transaction: t,
          }
        ),
        await queryInterface.removeColumn(
          "video_consultations",
          "expiry_reason",
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
