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
signup = async (request, response) => {
  // Validate request
  const errors = validationResult(request);
  if(!errors.isEmpty()) {
      let errorArray = errors.array().map(e => e.msg);
      return response.status(400).json({ error: errorArray[0] });
  }

  const {email, password, first_name, last_name, phone_num} = request.body;

  try {
    // validate that user does not exist yet in the db
    const userExists = await User.userExists(email);
    if(userExists) {
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

    const user_id = await User.signup(user);
    response.send({ id: user_id });

  } catch(err) {
    response.status(500).send({ error: "Internal Error while sign up" });
    //error: "Some error occurred while checking existence of User"
    //error: "Some error occurred while signing up the User"
  }
};

logInValidation = [
  check("email", "Email Is Required").not().isEmpty(),
  check("password", "Password Is Required").not().isEmpty(),
  check("email", "Not a valid email").isEmail()
];

// verify login password for the user
login = async (request, response) => {
  // Validate request
  const errors = validationResult(request);
  if(!errors.isEmpty()) {
    let errorArray = errors.array().map(e => e.msg);
    return response.status(400).json({ error: errorArray[0] });
  }

  const {email, password} = request.body;

  try {
    // validate that user should exist in the database
    const user = await User.findOne(email);
    if (!user) {
      return response.status(401).json({ error: "User does not exist" });
    }

    // check user password with hashed password stored in the database
    const match = await bcrypt.compare(password, user.password);
    if(match) {
      response.status(200).json({ id: user.user_id });  
    } else {
      response.status(401).json({ error: "Invalid Password" });  
    }

  } catch(err) {
    response.status(500).send({ error: "Internal Error while log in" });
  }
}

module.exports = {
  signUpValidation,
  signup,
  logInValidation,
  login
}
