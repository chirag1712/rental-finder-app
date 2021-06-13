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
      result(null, err);
      return;
    }

    console.log("user found: ", res);
    result(null, res);
  });
};

User.noUser = (email, result) => {
  sql.query("SELECT count(*) FROM User WHERE email = ? GROUP BY email", email, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }
    if(res == 0) {
      result(null, true);
      return;
    }
    else {
      console.log('User already exists');
      result(null, false);
      return;
    }
  });
};

User.getAll = result => {
  sql.query("SELECT * FROM User", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("users: ", res);
    result(null, res);
  });
};

User.remove = (user, result) => {
  sql.query("DELETE FROM User WHERE uid = ?", user.uid, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted user with uid: ", user.uid);
    result(null, res);
  });
};

module.exports = User;
