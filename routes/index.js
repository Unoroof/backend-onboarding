var express = require("express");
var router = express.Router();
var validate = require("validate.js");
var executeForResult = require("../app/functions/executeForResult");
var executeForResponse = require("../app/functions/executeForResponse");

const blogController = require("../app/controllers").blog;
const authorController = require("../app/controllers").author;
const createBlogRequest = require("../app/requests/createBlog");
const blogCollectionResponse = require("../app/responses/blogCollection");
const blogResourceResponse = require("../app/responses/blogResource");

router.get(
  "/blog",
  executeForResult(blogController.index, "blogList"),
  executeForResponse(blogCollectionResponse)
);

router.get(
  "/blog/:id",
  executeForResult(blogController.show),
  executeForResponse(blogResourceResponse)
);

router.post(
  "/blog",
  createBlogRequest,
  executeForResult(blogController.store),
  executeForResponse(blogResourceResponse)
);

router.put("/blog/:id", executeForResponse(blogController.update));

router.delete("/blog/:id", executeForResponse(blogController.delete));

router.post("/author", executeForResponse(authorController.store));

module.exports = router;
