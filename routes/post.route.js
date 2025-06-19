const express = require("express");
const router = express.Router();

const controller = require("../controllers/post.controller");

router.get("/:id", controller.getPost);

module.exports = router;