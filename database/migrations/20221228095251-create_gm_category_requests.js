"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("gm_category_requests", {
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      category_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      created_by: {
        allowNull: false,
        type: Sequelize.UUID,
      },
      status: {
        allowNull: false,
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

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("gm_category_requests");
  },
};
