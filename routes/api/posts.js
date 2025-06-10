const express = require("express");
const router = express.Router();

const controller = require("../../controllers/post.controller");

router.get("/", controller.getPosts);
router.post("/", controller.postPosts);

router.patch("/:id/like", controller.patchPosts);

router.post("/:id/retweet", controller.postRetweet);

router.get("/:id", controller.getReply);
router.post("/:id", controller.postReply);

module.exports = router;