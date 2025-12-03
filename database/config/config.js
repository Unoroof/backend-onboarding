var dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// SSL configuration for AWS RDS
const getDialectOptions = () => {
  if (process.env.DB_SSL === "true") {
    return {
      ssl: {
        rejectUnauthorized: true,
      },
    };
  }
  return {};
};

module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_SEQUELIZE_DIALECT,
    dialectOptions: getDialectOptions(),
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_SEQUELIZE_DIALECT,
    dialectOptions: getDialectOptions(),
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_SEQUELIZE_DIALECT,
    dialectOptions: getDialectOptions(),
  },
};
