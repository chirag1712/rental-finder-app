const bcrypt = require('bcrypt');
const User = require("../models/user.model.js");
//express validator
const { check, validationResult } = require("express-validator");

// signup a new User
exports.signup = async (request, result) => {
  // Validate request
  if (!request.body) {
    result.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // validate that user does not exist yet in the db
  User.noUser(request.body.email, (err, noUser) => {
    if (err) {
      result.status(500).send({
        message:
          err.message || "Some error occurred while checking existence of User."
      });
    } else if (!noUser) {
      result.status(400).json({ error: "User already exists." });
      return
    }
  })

  // encrypt password
  const salt = await bcrypt.genSalt(10);
  const e_password = await bcrypt.hash(request.body.password, salt);
  
  // Create a User
  const user = new User({
    email: request.body.email,
    password: e_password,
    first_name: request.body.first_name,
    last_name: request.body.last_name,
    phone_num: request.body.phone_num,
    password: e_password,
  });

  // Save User in the database
  User.signup(user, (err, data) => {
    if (err)
      result.status(500).send({
        message:
          err.message || "Some error occurred while signing up the User."
      });
    else result.send(data);
  });
};

exports.loginValidation = [
  check("email", "Email Is Required").not().isEmpty(),
  check("password", "Password Is Required").not().isEmpty(),
  check("email", "Not a valid email").isEmail(),
  check("password", "Password should be minmum of 8 characters").isLength({min: 8})
];

// verify login password for the user
exports.login = (request, result) => {
  // Validate request
  if (!request.body) {
    result.status(400).send({
      message: "Content can not be empty!"
    });
  }

  // validate that user should exist in the database
  User.findOne(request.body.email, (err, user) => {
    if (err) {
      result.status(500).send({
        message:
          err.message || "Some error occurred while logging in the User."
      });
    }

    if (!user.isEmpty) {
      // check user password with hashed password stored in the database
      bcrypt.compare(request.body.password, user[0].password, (err, res) => {
        if (res) {
          result.status(200).json({ message: "Valid password" });  
        } else {
          result.status(400).json({ error: "Invalid Password" });  
        }
      });
    } else {
      result.status(401).json({ error: "User does not exist" });
    }
  });
}

// return all Users
exports.findAll = (request, result) => {
  User.getAll((err, data) => {
    if (err)
      result.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else result.send(data);
  });
};

// delete a User by userId
exports.delete = (request, result) => {
  User.remove(request.params.userId, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        result.status(404).send({
          message: `Not found User with id ${request.params.userId}.`
        });
      } else {
        result.status(500).send({
          message: "Could not delete User with id " + request.params.userId
        });
      }
    } else result.send({ message: `User was deleted successfully!` });
  });
};
