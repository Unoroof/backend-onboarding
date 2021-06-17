var express = require("express");
var router = express.Router();
var validate = require("validate.js");
var executeForResult = require("../app/functions/executeForResult");
var executeForResponse = require("../app/functions/executeForResponse");

const profileController = require("../app/controllers").ProfileController; // Todo - Check how we loaded blog controller, add it to controller/index.js and load it
const profileCollectionResponse = require("../app/responses/profileCollection");
const profileResourceResponse = require("../app/responses/profileResource");
const createProfileRequest = require("../app/requests/createProfile");

router.get(
  "/profiles",
  executeForResult(profileController.index, "profileList"),
  executeForResponse(profileCollectionResponse)
);

router.post(
  "/profiles",
  createProfileRequest,
  executeForResult(profileController.storeOrUpdate),
  executeForResponse(profileResourceResponse)
);


module.exports = router;
