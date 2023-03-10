"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(
        "video_consultations", // table name
        "consultation_end_date_time", // new field name
        {
          allowNull: true,
          type: "TIMESTAMP",
        }
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(
          "video_consultations",
          "consultation_end_date_time",
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
