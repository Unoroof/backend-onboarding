"use strict";

const fs = require("fs");
const path = require("path");
const { Sequelize } = require("sequelize");
const basename = path.basename(__filename);
const db = {};

let sequelize;

const dialectOptions = {
  connectTimeout: 30000,
};

// SSL configuration for AWS RDS (and other cloud databases)
// AWS RDS requires SSL connections and uses valid certificates
// Enable SSL for production and staging environments

if (process.env.DB_SSL === "true") {
  dialectOptions.ssl = {
    rejectUnauthorized: false,
  };
}

sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USERNAME,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    dialect: process.env.DB_SEQUELIZE_DIALECT || "postgres",
    dialectOptions,
  }
);

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    console.log("file-----", file);
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
