"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GmCategoryRequests extends Model {}

  GmCategoryRequests.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      category_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GmCategoryRequests",
      tableName: "gm_category_requests",
      name: {
        singular: "GmCategoryRequest",
        plural: "GmCategoryRequests",
      },
    }
  );
  return GmCategoryRequests;
};
