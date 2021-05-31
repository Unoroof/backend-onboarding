"use strict";
const { Model } = require("sequelize");
const Author = require("./index").Author;

module.exports = (sequelize, DataTypes) => {
  class Blog extends Model {
    static associate(models) {
      Blog.belongsTo(models.Author, {
        foreignKey: "author_id",
        targetKey: "id",
        as: "author",
      });
    }
  }
  Blog.init(
    {
      title: DataTypes.STRING,
      excerpt: DataTypes.STRING,
      content: DataTypes.STRING,
      author_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Blog",
    }
  );

  return Blog;
};
