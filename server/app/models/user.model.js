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

User.getById = id => {
  return new Promise((resolve, reject) => {
    sql.query("SELECT * FROM User WHERE user_id = ?", id, (err, res) => {
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

User.getPostings = user_id => {
  return new Promise((resolve, reject) => {
    sql.query(`SELECT p.*, a.*, ph.photo_id, ph.url
    FROM Posting AS p
    NATURAL JOIN AddressOf AS ao
    NATURAL JOIN Address AS a
    LEFT OUTER JOIN PostingPhoto AS ph
    ON p.posting_id = ph.posting_id
    NATURAL JOIN User AS u
    WHERE p.user_id = ?;`, user_id, (err, res) => {
      if (err) {
        // console.log("error: ", err);
        reject(err);
      } else {
        // console.log(`user ${user_id}'s postings: `, res);
        resolve(res);
      }
    });
  });
};

module.exports = User;
