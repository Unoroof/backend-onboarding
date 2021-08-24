"use strict";
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("query_responses", {
      uuid: {
        type: Sequelize.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: Sequelize.UUIDV4,
      },
      profile_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      query_uuid: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      // query_type: {
      //   allowNull: false,
      //   type: Sequelize.STRING,
      // },

      data: { type: Sequelize.JSONB },

      status: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      owner_uuid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      assigned_uuid: {
        type: Sequelize.UUID,
        allowNull: true,
      },
      assigned_to_email: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      assigned_to_mobile: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("query_responses");
  },
};
