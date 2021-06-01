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
  "/blogs",
  executeForResult(blogController.index, "blogList"),
  executeForResponse(blogCollectionResponse)
);

router.get(
  "/blogs/:id",
  executeForResult(blogController.show),
  executeForResponse(blogResourceResponse)
);

router.post(
  "/blogs",
  createBlogRequest,
  executeForResult(blogController.store),
  executeForResponse(blogResourceResponse)
);

router.put("/blogs/:id", executeForResponse(blogController.update));

router.delete("/blogs/:id", executeForResponse(blogController.delete));

router.post("/author", executeForResponse(authorController.store));

module.exports = router;
