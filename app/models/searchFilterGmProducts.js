"use strict ";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class SearchFilterGmProducts extends Model {}

  SearchFilterGmProducts.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      sort_by: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "SearchFilterGmProducts",
    }
  );

  return SearchFilterGmProducts;
};
