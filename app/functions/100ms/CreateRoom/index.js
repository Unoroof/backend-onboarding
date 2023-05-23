const orchestrator = require(".././Orchestrator");
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

const createRoom = async (requestId) => {
  try {
    const videoConsultation = await knex("video_consultations")
      .where("uuid", requestId)
      .first();

    if (
      !["buyer_payment_done", "source_payment_done"].includes(
        videoConsultation.request_status
      )
    ) {
      throw new Error("Payment not done for the consultation");
    }

    if (videoConsultation.room_config?.id) {
      throw new Error("Room already created for the consultation");
    }

    const bankerProfile = await knex("profiles")
      .where("uuid", videoConsultation.destination)
      .first();

    const buyerProfile = await knex("profiles")
      .where("uuid", videoConsultation.source)
      .first();

    const payload = {
      name: `wiredup-room-${Date.now()}`,
      description: `${buyerProfile.data?.full_name} is connecting with ${bankerProfile.data?.full_name}`,
      template_id: process.env.VIDEO_CONSULTATION_TEMPLATE_ID,
      region: "in",
    };

    const endpoint = "/v2/rooms";

    const roomData = await orchestrator(endpoint, payload, "post");

    await knex("video_consultations")
      .update({ room_config: roomData })
      .where({ uuid: requestId });

    return roomData;
  } catch (err) {
    console.log("Error while create room", err);
    throw Error("Error while create room");
  }
};

module.exports = createRoom;
