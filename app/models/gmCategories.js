"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GMCategory extends Model {}

  GMCategory.init(
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
      modelName: "GMCategory",
      tableName: "gm_categories",
      name: {
        singular: "Category",
        plural: "Categories",
      },
    }
  );
  GMCategory.associate = (models) => {
    GMCategory.belongsToMany(models.GMProduct, {
      through: "gm_products_categories",
      foreignKey: "category_uuid",
      as: {
        singular: "product",
        plural: "products",
      },
    });
  };
  return GMCategory;
};
