"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("video_consultations", {
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
      },
      buyer_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      banker_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      query_category: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      first_time_borrower: {
        type: Sequelize.BOOLEAN,
        allowNull: true,
      },
      company_vintage_years: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      company_vintage_months: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      requirement_description: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      query_date_time: {
        type: "TIMESTAMP",
        allowNull: false,
      },
      request_status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      banker_accepted_on: {
        type: "TIMESTAMP",
        allowNull: true,
      },
      banker_rejected_on: {
        type: "TIMESTAMP",
        allowNull: true,
      },
      banker_config_info: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      payment_status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      payment_details: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      room_config: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false,
      },
      deletedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: true,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable("video_consultations");
  },
};
