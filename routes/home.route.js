const express = require("express");
const router = express.Router();

const controller = require("../controllers/home.controller");
const middleware = require("../middleware");

router.get("/",
    middleware.requireLogin,
    controller.index
);

module.exports = router;