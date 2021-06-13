const express = require('express');
const router = express.Router();

const users = require("../controllers/user.controller.js");

// @route  POST api/users/login
// @desc   signs up a user
// @access PRIVATE
router.post("/signup", users.signUpValidation, users.signup);

// @route  POST api/users/login
// @desc   logins a user
// @access PRIVATE
router.post("/login", users.logInValidation, users.login);

module.exports = router;
