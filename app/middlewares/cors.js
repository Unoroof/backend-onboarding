// middleware/cors.js
const cors = require("cors");

const corsOptions = {
  origin: "*", // Replace with your allowed origin
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
  optionsSuccessStatus: 204,
};

module.exports = cors(corsOptions);
