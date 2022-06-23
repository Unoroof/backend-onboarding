"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("billDiscountProgram", {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      daily_bids_uuid: {
        type: Sequelize.UUID,
      },
      request_by: {
        type: Sequelize.UUID,
      },
      request_to: {
        type: Sequelize.UUID,
      },
      invoices: {
        type: Sequelize.JSONB,
      },
      data: {
        type: Sequelize.JSONB,
      },
      status: {
        type: Sequelize.STRING,
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
        allowNull: true,
      },
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable("billDiscountProgram");
  },
};
