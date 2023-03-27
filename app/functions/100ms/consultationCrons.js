var dotenv = require("dotenv");
dotenv.config({ path: ".env" });

const disableRoom = require("./disableRoom");
const expireFutureConsultation = require("./expireFutureConsultation");
const expireLiveConsultation = require("./expireLiveConsultation");

const consultationCrons = async () => {
  try {
    disableRoom();
    expireFutureConsultation();
    expireLiveConsultation();
  } catch (err) {
    console.log("Error while disable room", err);
  }
};

consultationCrons();
