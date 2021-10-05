"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QueryResponse extends Model {}

  QueryResponse.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      profile_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      query_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },

      data: { type: DataTypes.JSONB },

      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      owner_uuid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      assigned_uuid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      assigned_to_email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      assigned_to_mobile: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      query_type: { type: DataTypes.STRING },
    },
    {
      sequelize,
      modelName: "QueryResponse",
      tableName: "query_responses",
    }
  );
  return QueryResponse;
};
