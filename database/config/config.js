var dotenv = require("dotenv");
dotenv.config({ path: ".env" });

// Helper function to build dialect options with SSL
const getDialectOptions = () => {
  const dialectOptions = {};
  
  // Enable SSL if DB_SSL is set to "true" or for production/staging environments
  if (process.env.DB_SSL === "true") {
    dialectOptions.ssl = {
      rejectUnauthorized: true,
    };
  }
  
  return dialectOptions;
};

const baseConfig = {
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  dialect: process.env.DB_SEQUELIZE_DIALECT,
  dialectOptions: getDialectOptions(),
};

module.exports = {
  development: baseConfig,
  test: baseConfig,
  production: baseConfig,
  staging: baseConfig,
};
