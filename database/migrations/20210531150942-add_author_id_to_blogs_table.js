"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          "Blogs",
          "author_id",
          {
            type: Sequelize.INTEGER,
            allowNull: true,
          },
          { transaction: t }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn("Blogs", "author_id", {
          transaction: t,
        }),
      ]);
    });
  },
};
