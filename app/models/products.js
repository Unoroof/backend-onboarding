"use strict "
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model { }

    Product.init(
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
            modelname: "Product",
            tablename: "products",
            name: {
                singular: "product",
                plural: "products"
            },

        }
    );
    return profilerevision;
}
