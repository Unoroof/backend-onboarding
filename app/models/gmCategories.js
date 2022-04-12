"use strict ";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class GmCategory extends Model {}

  GmCategory.init(
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
      modelName: "GmCategory",
      tableName: "gm_categories",
      name: {
        singular: "gm_category",
        plural: "gm_categories",
      },
    }
  );
  GmCategory.associate = (models) => {
    GmCategory.belongsToMany(models.GmProduct, {
      through: "gm_products_categories",
      foreignKey: "category_uuid",
      as: {
        singular: "gm_product",
        plural: "gm_products",
      },
    });
  };
  return GmCategory;
};
