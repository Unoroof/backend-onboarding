"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Product extends Model {}

  Product.init(
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
      modelName: "Product",
      tableName: "fm_products",
      name: {
        singular: "product",
        plural: "products",
      },
    }
  );
  Product.associate = (models) => {
    Product.belongsToMany(models.Category, {
      through: "fm_products_categories",
      foreignKey: "product_uuid",
      as: {
        singular: "category",
        plural: "categories",
      },
    });
  };
  return Product;
};
