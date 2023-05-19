"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.renameColumn(
        "video_consultations",
        "banker_accepted_on",
        "destination_accepted_on"
      ),

      await queryInterface.renameColumn(
        "video_consultations",
        "banker_rejected_on",
        "destination_rejected_on"
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      return Promise.all([
        await queryInterface.renameColumn(
          "video_consultations",
          "destination_accepted_on",
          "banker_accepted_on",
          {
            transaction: t,
          }
        ),
        await queryInterface.renameColumn(
          "video_consultations",
          "destination_rejected_on",
          "banker_rejected_on",
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
