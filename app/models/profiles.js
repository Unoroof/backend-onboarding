"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Profile extends Model {}

  Profile.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      user_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      type: {
        type: DataTypes.STRING,
      },
      data: DataTypes.JSONB,
      onboarded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      status: DataTypes.STRING,
      createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      video_consultation_enabled: {
        allowNull: true,
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      video_consultation_data: {
        allowNull: true,
        type: DataTypes.JSONB,
      },
    },
    {
      sequelize,
      modelName: "Profile",
      tableName: "profiles",
    }
  );
  return Profile;
};
