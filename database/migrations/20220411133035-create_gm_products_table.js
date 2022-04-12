"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("gm_products", {
      uuid: {
        allowNull: false,
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      profile_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },
      name: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING,
      },
      brand_name: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      price: { type: Sequelize.JSONB },
      discount: { type: Sequelize.JSONB },
      data: { type: Sequelize.JSONB },
      status: {
        allowNull: false,
        type: Sequelize.STRING,
        defaultValue: "drafted",
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
    await queryInterface.dropTable("gm_products");
  },
};
