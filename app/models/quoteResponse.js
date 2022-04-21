"use strict ";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class QuoteResponse extends Model {}

  QuoteResponse.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      buyer_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quote_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      seller_uuid: {
        type: DataTypes.STRING,
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
    },
    {
      sequelize,
      modelName: "QuoteResponse",
      tableName: "quote_responses",
    }
  );

  return QuoteResponse;
};
