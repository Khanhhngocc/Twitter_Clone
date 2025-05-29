const express = require("express");
const router = express.Router();

const controller = require("../../controllers/post.controller");

router.get("/", controller.getPosts);

router.post("/", controller.postPosts);

module.exports = router;