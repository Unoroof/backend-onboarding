"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Category extends Model {}

  Category.init(
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
      modelName: "Category",
      tableName: "fm_categories",
      name: {
        singular: "Category",
        plural: "Categories",
      },
    }
  );
  Category.associate = (models) => {
    Category.belongsToMany(models.Product, {
      through: "fm_products_categories",
      foreignKey: "category_uuid",
      as: {
        singular: "product",
        plural: "products",
      },
    });
  };
  return Category;
};
