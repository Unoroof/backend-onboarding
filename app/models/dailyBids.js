"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DailyBids extends Model {}

  DailyBids.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      profile_uuid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      bids: {
        type: DataTypes.JSONB,
      },
      data: {
        type: DataTypes.JSONB,
      },
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
        allowNull: false,
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "DailyBids",
      tableName: "dailyBids",
    }
  );
  return DailyBids;
};
