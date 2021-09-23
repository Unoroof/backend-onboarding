"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */

    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.renameTable("fp_categories", "fm_categories", {
          transaction: t,
        }),

        queryInterface.renameTable("fp_products", "fm_products", {
          transaction: t,
        }),
        queryInterface.renameTable(
          "fp_products_categories",
          "fm_products_categories",
          {
            transaction: t,
          }
        ),
      ]);
    });
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
