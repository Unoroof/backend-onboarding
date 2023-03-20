const generateAuthToken = require("./GenerateAuthToken/generateAuthToken");
const generateManagementToken = require("./GenerateManagementToken");
const createRoom = require("./CreateRoom");
const disableRoom = require("./DisableRoom");

module.exports = {
  generateAuthToken,
  createRoom,
  generateManagementToken,
  disableRoom,
};
