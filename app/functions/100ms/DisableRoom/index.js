var dotenv = require("dotenv");
dotenv.config({ path: ".env" });

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
    const rolesData = await orchestrator(endPoint, payload, "get");

    const peersListRoles = rolesData?.data
      ?.map((item) => Object.values(item.peers))
      .flat()
      .map((item) => item.role);

    const joinedUniqueRoles = [...new Set(peersListRoles)];

    return joinedUniqueRoles;
  } catch (err) {
    console.log("error while get joined roles", err);
  }
};

const updateVideoConsultationStatus = async (
  joinedUniqueRoles,
  videoConsultation
) => {
  try {
    if (
      joinedUniqueRoles.includes("participator") &&
      joinedUniqueRoles.includes("presenter")
    ) {
      return await knex("video_consultations")
        .update({ request_status: "consultation_done" })
        .where({ uuid: videoConsultation.uuid });
    } else if (joinedUniqueRoles.includes("presenter")) {
      return await knex("video_consultations")
        .update({ request_status: "buyer_not_joined" })
        .where({ uuid: videoConsultation.uuid });
    } else if (joinedUniqueRoles.includes("participator")) {
      return await knex("video_consultations")
        .update({ request_status: "banker_not_joined" })
        .where({ uuid: videoConsultation.uuid });
    } else {
      return await knex("video_consultations")
        .update({ request_status: "buyer_banker_not_joined" })
        .where({ uuid: videoConsultation.uuid });
    }
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
    // const tzTime = moment()
    //   .utc()
    //   .tz("asia/kolkata")
    //   .format("YYYY-MM-DD HH:mm:ss");
    console.log("process.env", process.env);

    const dateTime = moment().format("YYYY-MM-DD HH:mm:ss");

    console.log("disable room dateTime ", dateTime);

    const videoConsultation = await knex("video_consultations")
      .where("request_status", "buyer_payment_done")
      .where("payment_status", "paid")
      .where("consultation_end_date_time", "<", dateTime);

    for (i = 0; i < videoConsultation.length; i++) {
      const consultationRequest = videoConsultation[i];
      const roomId = consultationRequest?.room_config?.id;

      if (roomId) {
        await endActiveRoomIn100ms(roomId);
        const joinedUniqueRoles = await getJoinedRolesIn100ms(roomId);
        if (joinedUniqueRoles) {
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

disableRoom();
