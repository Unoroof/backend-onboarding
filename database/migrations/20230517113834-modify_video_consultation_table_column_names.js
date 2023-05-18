"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.renameColumn(
        "video_consultations",
        "buyer_uuid",
        "source"
      ),

      await queryInterface.renameColumn(
        "video_consultations",
        "banker_uuid",
        "destination"
      ),

      await queryInterface.renameColumn(
        "video_consultations",
        "banker_config_info",
        "destination_config_info"
      ),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      return Promise.all([
        await queryInterface.renameColumn(
          "video_consultations",
          "source",
          "buyer_uuid",
          {
            transaction: t,
          }
        ),
        await queryInterface.renameColumn(
          "video_consultations",
          "destination",
          "banker_uuid",
          {
            transaction: t,
          }
        ),
        await queryInterface.renameColumn(
          "video_consultations",
          "destination_config_info",
          "banker_config_info",
          {
            transaction: t,
          }
        ),
      ]);
    });
  },
};
