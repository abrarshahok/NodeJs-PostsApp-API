const express = require("express");
const router = express.Router();
const postValidator = require("../validators/posts-validator.js");

const {
  validationResultHandler,
} = require("../validators/validation-result-handler.js");

const feedController = require("../controllers/feed-controller.js");

router.get("/posts", feedController.getPosts);

router.get("/posts/:postId", feedController.getPost);

router.post(
  "/post",
  postValidator.validateAddPostRules(),
  validationResultHandler,
  feedController.addPost
);

router.put("/post/:postId", feedController.updatePost);

router.delete("/post/:postId", feedController.deletePost);

module.exports = router;
