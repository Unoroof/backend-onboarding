var express = require("express");
var router = express.Router();
var validate = require("validate.js");
var executeForResult = require("../app/functions/executeForResult");
var executeForResponse = require("../app/functions/executeForResponse");

const profileController = require("../app/controllers/profile"); // Todo - Check how we loaded blog controller, add it to controller/index.js and load it
const profileCollectionResponse = require("../app/responses/profileCollection");
const profileResourceResponse = require("../app/responses/profileResource");
const createProfileRequest = require("../app/requests/createProfile");

//Todo - Remove code which we don't use
// const blogController = require("../app/controllers").blog;
// const authorController = require("../app/controllers").author;
// const createBlogRequest = require("../app/requests/createBlog");
// const blogCollectionResponse = require("../app/responses/blogCollection");
// const blogResourceResponse = require("../app/responses/blogResource");

//Todo - Use plurals - /profiles
router.get(
  "/profile",
  executeForResult(profileController.index, "profileList"),
  executeForResponse(profileCollectionResponse)
);

router.post(
  "/profile",
  createProfileRequest,
  executeForResult(profileController.storeOrUpdate),
  executeForResponse(profileResourceResponse)
);

// router.put("/blogs/:id", executeForResponse(blogController.update));

// router.delete("/blogs/:id", executeForResponse(blogController.delete));

// router.post("/author", executeForResponse(authorController.store));

module.exports = router;
