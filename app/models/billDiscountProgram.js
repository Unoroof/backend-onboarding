"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BillDiscountProgram extends Model {}

  BillDiscountProgram.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      daily_bids_uuid: {
        type: DataTypes.UUID,
      },
      request_by: {
        type: DataTypes.UUID,
      },
      request_to: {
        type: DataTypes.UUID,
      },
      invoices: {
        type: DataTypes.JSONB,
      },
      data: {
        type: DataTypes.JSONB,
      },
      status: {
        type: DataTypes.STRING,
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
      modelName: "BillDiscountProgram",
      tableName: "billDiscountProgram",
    }
  );
  return BillDiscountProgram;
};
