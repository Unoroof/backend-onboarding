var dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const disableRoom = require("./disableRoom");
const expireFutureConsultation = require("./expireFutureConsultation");
const expireLiveConsultation = require("./expireLiveConsultation");
const notificationReminder = require("./notificationReminder");
const expireGmModuleRequests = require("./expireGmModuleRequests");

const consultationCrons = async () => {
  try {
    disableRoom();
    expireFutureConsultation();
    expireLiveConsultation();
    notificationReminder();
    expireGmModuleRequests();
  } catch (err) {
    console.log("Error consultation crons", err);
  }
};

consultationCrons();
