const users = require("../controllers/user.controller.js");
const express = require('express');
const router = express.Router();

// create a new User
router.post("/signup", users.signup);

// @route  POST api/users/login
// @desc   logins a user
// @access PRIVATE
router.post("/login", users.loginValidation, users.login)

// return all Users
router.get("/", users.findAll);

// delete a User by userId
router.delete("/:user", users.delete);

module.exports = router;
