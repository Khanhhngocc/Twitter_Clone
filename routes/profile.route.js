const express = require("express");
const router = express.Router();

const controller = require("../controllers/profile.controller");

router.get("/:username", controller.index);

router.get("/:username/replies", controller.reply);

router.get("/:username/following", controller.following);
router.get("/:username/followers", controller.followers);

module.exports = router;