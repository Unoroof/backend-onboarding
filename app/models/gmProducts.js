"use strict ";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class GmProduct extends Model {}

  GmProduct.init(
    {
      uuid: {
        allowNull: false,
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      profile_uuid: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      name: {
        allowNull: false,
        unique: true,
        type: DataTypes.STRING,
      },
      brand_name: {
        allowNull: false,
        type: DataTypes.STRING,
      },
      price: { type: DataTypes.JSONB },
      discount: { type: DataTypes.JSONB },
      data: { type: DataTypes.JSONB },
      status: {
        allowNull: false,
        type: DataTypes.STRING,
        defaultValue: "drafted",
      },
    },
    {
      sequelize,
      modelName: "GmProduct",
      tableName: "gm_products",
      name: {
        singular: "gm_product",
        plural: "gm_products",
      },
    }
  );
  GmProduct.associate = (models) => {
    GmProduct.belongsToMany(models.GmCategory, {
      through: "gm_products_categories",
      foreignKey: "product_uuid",
      as: {
        singular: "gm_category",
        plural: "gm_categories",
      },
    });
  };
  return GmProduct;
};
