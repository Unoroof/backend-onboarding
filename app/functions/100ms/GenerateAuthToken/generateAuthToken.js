const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const knex = require("knex")({
  client: "pg",
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    application_name: process.env.APP_NAME || "nobe-runner",
  },
});

const generateAuthToken = async (userId, requestId, role) => {
  try {
    const videoConsultation = await knex("video_consultations")
      .where("uuid", requestId)
      .first();

    if (!videoConsultation.room_config?.id) {
      throw new Error("Room not created in 100ms");
    }

    const roomID = videoConsultation.room_config?.id;

    const appSecret = process.env.VIDEO_CONSULTATION_SECRET;

    let payload = {
      access_key: process.env.VIDEO_CONSULTATION_ACCESS_KEY,
      room_id: roomID,
      user_id: userId,
      role: role,
      type: "app",
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

module.exports = generateAuthToken;
