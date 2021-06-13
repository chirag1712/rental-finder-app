const bcrypt = require('bcrypt');
const User = require("../models/user.model.js");
//express validator
const { check, validationResult } = require("express-validator");


signUpValidation = [
  check("email", "Email Is Required").not().isEmpty(),
  check("password", "Password Is Required").not().isEmpty(),
  check("first_name", "First name is required").not().isEmpty(),
  check("last_name", "Last name is required").not().isEmpty(),
  check("email", "Not a valid email").isEmail(),
  check("password", "Minimum length of 8 required").isLength({ min: 8})
];

// signup a new User
signup = (request, response) => {
  // Validate request
  const errors = validationResult(request);
  if(!errors.isEmpty()) {
      let errorArray = errors.array().map(e => e.msg);
      return response.status(400).json({ error: errorArray[0] });
  }

  const {email, password, first_name, last_name, phone_num} = request.body;

  // validate that user does not exist yet in the db
  User.userExists(email, async (err, userExists) => {
    if (err) {
      return response.status(500).send({
        error: "Some error occurred while checking existence of User"
      });
    } else if (userExists) {
      return response.status(400).json({ error: "User already exists" });
    }

    // encrypt password
    const salt = await bcrypt.genSalt(10);
    const e_password = await bcrypt.hash(password, salt);
    
    // Create a User
    const user = new User({
      email,
      password: e_password,
      first_name,
      last_name,
      phone_num
    });

    // Save User in the database
    User.signup(user, (err, data) => {
      if (err) {
        return response.status(500).send({ 
          error: "Some error occurred while signing up the User"
        });
      } else response.send({ id: data.user_id });
    });
  });
};

logInValidation = [
  check("email", "Email Is Required").not().isEmpty(),
  check("password", "Password Is Required").not().isEmpty(),
  check("email", "Not a valid email").isEmail()
];

// verify login password for the user
login = (request, response) => {
  // Validate request
  const errors = validationResult(request);
  if(!errors.isEmpty()) {
      let errorArray = errors.array().map(e => e.msg);
      return response.status(400).json({ error: errorArray[0] });
  }

  const {email, password} = request.body;
  // validate that user should exist in the database
  User.findOne(email, (err, user) => {
    if (err) {
      return response.status(500).send({
        error: "Some error occurred while logging in the User"
      });
    }

    if (user[0]) {
      // check user password with hashed password stored in the database
      bcrypt.compare(password, user[0].password, (err, res) => {
        if (res) {
          response.status(200).json({ id: user[0].user_id });  
        } else {
          response.status(401).json({ error: "Invalid Password" });  
        }
      });
    } else {
      response.status(401).json({ error: "User does not exist" });
    }
  });
}

module.exports = {
  signUpValidation,
  signup,
  logInValidation,
  login
}
