const moment = require("moment-timezone");
const orchestrator = require("../Orchestrator");

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

const endActiveRoomIn100ms = async (id) => {
  try {
    const payload = {};

    const endpoint = `/v2/active-rooms/${id}/end-room`;

    const roomData = await orchestrator(endpoint, payload, "post");
    return roomData;
  } catch (err) {
    if (!err.response?.data?.code === 404) {
      console.log(`error while room id ${id}`, err.response);
    }
  }
};

const getJoinedRolesIn100ms = async (id) => {
  try {
    const payload = {
      params: {
        room_id: id,
        limit: 100,
      },
    };

    const endPoint = `/v2/sessions`;
    const sessionData = await orchestrator(endPoint, payload, "get");

    const peersListRoles = sessionData?.data
      ?.map((item) => Object.values(item.peers))
      .flat()
      .map((item) => item.role);

    const joinedUniqueRoles = [...new Set(peersListRoles)];

    return { joinedUniqueRoles, sessionData };
  } catch (err) {
    console.log("error while get joined roles", err);
  }
};

const updateSessionData = async (sessionData, videoConsultation) => {
  try {
    return await knex("video_consultations")
      .update({ video_session_data: sessionData })
      .where({ uuid: videoConsultation.uuid });
  } catch (err) {
    console.log(
      `error while updating the session data ${videoConsultation.uuid}`,
      err
    );
  }
};

const updateVideoConsultationStatus = async (
  joinedUniqueRoles,
  videoConsultation
) => {
  try {
    const isGmModule = videoConsultation.module === "gm_module";

    let requestStatus = "consultation_done";

    if (
      joinedUniqueRoles.includes("participator") &&
      joinedUniqueRoles.includes("presenter")
    ) {
      requestStatus = "consultation_done";
    } else if (joinedUniqueRoles.includes("presenter")) {
      requestStatus = isGmModule ? "source_not_joined" : "buyer_not_joined";
    } else if (joinedUniqueRoles.includes("participator")) {
      requestStatus = isGmModule
        ? "destination_not_joined"
        : "banker_not_joined";
    } else {
      requestStatus = isGmModule
        ? "source_destination_not_joined"
        : "buyer_banker_not_joined";
    }

    return await knex("video_consultations")
      .update({
        request_status: requestStatus,
      })
      .where({ uuid: videoConsultation.uuid });
  } catch (err) {
    console.log(
      `error while updating the consultation status ${videoConsultation.uuid}`,
      err
    );
  }
};

const disableRoom = async () => {
  try {
    // Need to check with server timezone
    const tzTime = moment()
      .utc()
      .tz("asia/kolkata")
      .format("YYYY-MM-DD HH:mm:ss");

    console.log("disableRoom tzTime ", tzTime);

    const videoConsultation = await knex("video_consultations")
      .where("payment_status", "paid")
      .whereIn("request_status", ["buyer_payment_done", "source_payment_done"])
      .where("consultation_end_date_time", "<", tzTime);

    console.log(
      "disableRoom video consultation uuids",
      videoConsultation.map((item) => item.uuid)
    );

    for (i = 0; i < videoConsultation.length; i++) {
      const consultationRequest = videoConsultation[i];
      const roomId = consultationRequest?.room_config?.id;

      if (roomId) {
        await endActiveRoomIn100ms(roomId);
        const { joinedUniqueRoles, sessionData } = await getJoinedRolesIn100ms(
          roomId
        );
        if (joinedUniqueRoles) {
          await updateSessionData(sessionData, consultationRequest);
          await updateVideoConsultationStatus(
            joinedUniqueRoles,
            consultationRequest
          );
        }
      }
    }
    await knex.destroy();
    return true;
  } catch (err) {
    console.log("Error while disable room", err);
    await knex.destroy();
  }
};

module.exports = disableRoom;
