"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Enquiries extends Model {}

  Enquiries.init(
    {
      uuid: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
        allowNull: false,
      },
      user_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      },
      data: {
        type: DataTypes.JSONB,
      },
      status: {
        type: DataTypes.STRING,
      },
      payment_status: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      deletedAt: "deletedAt",
      modelName: "Enquiries",
      tableName: "enquiries",
    }
  );
  return Enquiries;
};
