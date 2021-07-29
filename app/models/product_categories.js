"use strict "
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ProductCategory extends Model { }

    ProductCategory.init(
        {
            uuid: {
                type: DataTypes.UUID,
                allowNull: false,
                primaryKey: true,
                defaultValue: DataTypes.UUIDV4
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: "ProductCategory",
            tableName: "product_categories",
            name: {
                singular: "productCategory",
                plural: "productCategories"
            }
        }
    );
    ProductCategory.associate = models => {
        ProductCategory.belongsToMany(models.Product, {
            through: 'pivot_products_categories', foreignKey: 'category_uuid', as: {
                singular: 'product',
                plural: 'products'
            }
        })
    };
    return ProductCategory;
}
