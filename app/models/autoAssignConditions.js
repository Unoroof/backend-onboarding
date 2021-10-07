"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class AutoAssignConditions extends Model {}

  AutoAssignConditions.init(
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
      matching_criteria: {
        type: DataTypes.JSONB,
      },
      assign_to: {
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      createdAt: "createdAt",
      updatedAt: "updatedAt",
      modelName: "AutoAssignConditions",
      tableName: "auto_assign_conditions",
    }
  );
  return AutoAssignConditions;
};
