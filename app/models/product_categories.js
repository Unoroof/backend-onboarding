"use strict "
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Category extends Model { }

    Category.init(
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
            modelName: "Category",
            tableName: "categories",
            name: {
                singular: "category",
                plural: "categories"
            }
        }
    );
    return Category;
}
