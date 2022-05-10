"use strict ";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Quotes extends Model {}

  Quotes.init(
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
      data: {
        type: DataTypes.JSONB,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Quotes",
      tableName: "quotes",
    }
  );

  return Quotes;
};
