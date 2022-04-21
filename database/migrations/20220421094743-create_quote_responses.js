"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("quote_responses", {
      uuid: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      buyer_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      quote_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      seller_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      data: {
        type: Sequelize.JSONB,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
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
    await queryInterface.dropTable("quote_responses");
  },
};
