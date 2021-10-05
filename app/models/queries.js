"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Queries extends Model {}

  Queries.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      profile_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.JSONB,
      },
      sellers: {
        type: DataTypes.JSONB,
      },
      status: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      modelName: "Queries",
      tableName: "queries",
    }
  );
  return Queries;
};
