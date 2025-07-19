const express = require("express");
const router = express.Router();


const controller = require("../../controllers/user.controller");

router.patch("/:userId/follow", controller.follow);

router.get("/:userId/following", controller.following);
router.get("/:userId/followers", controller.followers);

);

module.exports = router