"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GMProduct extends Model {}

  GMProduct.init(
    {
      uuid: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "GMProduct",
      tableName: "gm_products",
      name: {
        singular: "product",
        plural: "products",
      },
    }
  );
  GMProduct.associate = (models) => {
    GMProduct.belongsToMany(models.GMCategory, {
      through: "gm_products_categories",
      foreignKey: "product_uuid",
      as: {
        singular: "category",
        plural: "categories",
      },
    });
  };
  return GMProduct;
};
