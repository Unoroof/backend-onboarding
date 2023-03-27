"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn(
        "video_consultations",
        "query_category",
        {
          type: Sequelize.UUID,
          allowNull: true,
        }
      ),

      await queryInterface.changeColumn(
        "video_consultations",
        "query_date_time",
        {
          type: "TIMESTAMP",
          allowNull: true,
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.changeColumn(
        "video_consultations",
        "query_category",
        {
          type: Sequelize.UUID,
          allowNull: false,
        }
      ),

      await queryInterface.changeColumn(
        "video_consultations",
        "query_date_time",
        {
          type: "TIMESTAMP",
          allowNull: false,
        }
      ),
    ]);
  },
};
