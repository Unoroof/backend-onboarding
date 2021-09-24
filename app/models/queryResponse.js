"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class QueryResponse extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }

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
    },
    {
      sequelize,
      modelName: "QueryResponse",
    }
  );
  return QueryResponse;
};
