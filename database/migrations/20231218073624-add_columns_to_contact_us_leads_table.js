"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn("contact_us_leads", "type", {
      allowNull: true,
      type: Sequelize.STRING,
      defaultValue: "call_request",
    });

    await queryInterface.addColumn("contact_us_leads", "user_uuid", {
      allowNull: true,
      type: Sequelize.STRING,
      defaultValue: null,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn("contact_us_leads", "type", {
      transaction: t,
    });
    await queryInterface.removeColumn("contact_us_leads", "user_uuid", {
      transaction: t,
    });
  },
};
