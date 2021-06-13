const sql = require("./db.js");

// constructor
const User = function (user) {
  this.email = user.email;
  this.first_name = user.first_name;
  this.last_name = user.last_name;
  this.phone_num = user.phone_num;
  this.password = user.password;
};

User.signup = newUser => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO User SET ?", newUser, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        console.log("created user: ", { user_id: res.insertId, ...newUser });
        resolve(res.insertId);
      }
    });
  });
}

User.findOne = email => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM User WHERE email = ?", email, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        console.log("user found: ", res);
        resolve(res[0]);
      }
    });
  });
}

module.exports = User;
