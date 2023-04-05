var dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const disableRoom = require("./disableRoom");
const expireFutureConsultation = require("./expireFutureConsultation");
const expireLiveConsultation = require("./expireLiveConsultation");
const notificationReminder = require("./notificationReminder");
const consultationCrons = async () => {
  try {
    disableRoom();
    expireFutureConsultation();
    expireLiveConsultation();
    notificationReminder();
  } catch (err) {
    console.log("Error while disable room", err);
  }
};

consultationCrons();
