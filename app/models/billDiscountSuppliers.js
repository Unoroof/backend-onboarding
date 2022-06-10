"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BillDiscountSuppliers extends Model {}

  BillDiscountSuppliers.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      invited_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      company_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      profile_uuid: {
        type: DataTypes.UUID,
        allowNull: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      invoices: {
        type: DataTypes.JSONB,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
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
      modelName: "BillDiscountSuppliers",
      tableName: "billDiscountSuppliers",
    }
  );
  return BillDiscountSuppliers;
};
