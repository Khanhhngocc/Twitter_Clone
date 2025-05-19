const express = require("express");
const router = express.Router();

const controller = require("../controllers/auth.controller");
const validate = require("../validates/auth.validate");

router.get("/login", controller.login);
router.post(
    "/login", 
    validate.login,
    controller.loginPost);

router.get("/register", controller.register);
router.post(
    "/register",
    validate.register,
    controller.registerPost
);

router.get("/logout", controller.logout);


module.exports = router;