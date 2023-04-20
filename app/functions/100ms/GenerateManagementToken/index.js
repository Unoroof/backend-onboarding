const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");

const GenerateManagementToken = async () => {
  try {
    const appSecret = process.env.VIDEO_CONSULTATION_SECRET;

    const payload = {
      access_key: process.env.VIDEO_CONSULTATION_ACCESS_KEY,
      type: "management",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000),
    };

    return new Promise((resolve, reject) => {
      jwt.sign(
        payload,
        appSecret,
        {
          algorithm: "HS256",
          expiresIn: "24h",
          jwtid: uuidv4(),
        },
        (err, token) => {
          if (err) reject(err);

          if (token) resolve(token);
        }
      );
    });
  } catch (err) {
    console.log("Error while generate auth token", err);
    throw Error("Error while generate auth token");
  }
};

module.exports = GenerateManagementToken;
