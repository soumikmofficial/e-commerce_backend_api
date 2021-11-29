const express = require("express");
const { login, logout, register } = require("../controllers/authController");
const router = express.Router();
//function import from controllers

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);

module.exports = router;
