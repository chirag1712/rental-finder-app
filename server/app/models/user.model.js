const sql = require("./db.js");

// constructor
const User = function(user) {
  this.email = user.email;
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.phone_num = user.phone_num;
  this.password = user.password;
};

User.signup = (newUser, result) => {
  sql.query("INSERT INTO User SET ?", newUser, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created user: ", { user_id: res.insertId, ...newUser });
    result(null, { user_id: res.insertId, ...newUser });
  });
};

User.findOne = (email, result) => {
  sql.query("SELECT * FROM User WHERE email = ?", email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("user found: ", res);
    result(null, res);
  });
};

User.userExists = (email, result) => {
  sql.query("SELECT count(*) FROM User WHERE email = ? GROUP BY email", email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    result(null, res != 0);
  });
};

module.exports = User;
