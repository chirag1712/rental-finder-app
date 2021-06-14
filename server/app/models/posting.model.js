const sql = require("./db.js");
const moment = require('moment');

// constructor
const Posting = function (posting) {
  this.user_id = posting.user_id;
  this.term = posting.term;
  this.start_date = posting.start_date;
  this.end_date = posting.end_date;
  this.pop = 0;
  this.price_per_month = posting.price_per_month;
  this.gender_details = posting.gender_details;
  this.rooms_available = posting.rooms_available;
  this.total_rooms = posting.total_rooms;
  this.description = posting.description;

  // check how to implement these
  this.created_at = posting.created_at ?? moment().format();
  //posting.created_at ?? new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
  this.updated_at = posting.created_at ?? moment().format();
  //posting.updated_at ?? new Date().toISOString().replace(/T/, ' ').replace(/\..+/, '');
};

const Address = function (address) {
  this.street_num = address.street_num;
  this.street_name = address.street_name;
  this.city = address.city;
  this.postal_code = address.postal_code;
  this.building_name = address.building_name;
};

const AddressOf = function (addressof) {
  this.posting_id = addressof.posting_id;
  this.address_id = addressof.address_id;
};

//check if user_id exists in database
Posting.userCheck = userId => {
  return new Promise((resolve, reject) => {
    sql.query(
      "SELECT * FROM User WHERE user_id = ?", userId, (err, res) => {
        if (err) {
          console.log("error: ", err);
          reject(err);
        } else {
          resolve(res[0]);
        }
      });
  });
}

Posting.create = newPosting => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO Posting SET ?", newPosting, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err)
      } else {
        const createdPosting = { posting_id: res.insertId, ...newPosting }
        console.log("created posting: ", createdPosting);
        resolve(createdPosting);
      }
    });
  });
};

// TODO(chirag): look into comibining search and create address endoints into one
Address.search = address => {
  return new Promise((resolve, reject) => {
    var query = "SELECT * FROM Address WHERE street_num = ? AND postal_code = ?";
    sql.query(query, [address.street_num, address.postal_code], (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        console.log("address from db: ", res);
        resolve(res);
      }
    }
    );
  });
};

Address.create = newAddress => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO Address SET ?", newAddress, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      } else {
        const createdAddress = { address_id: res.insertId, ...newAddress };
        console.log("created address: ", createdAddress);
        resolve(createdAddress);
      }
    });
  });
};

AddressOf.create = newAddressOf => {
  return new Promise((resolve, reject) => {
    sql.query("INSERT INTO AddressOf SET ?", newAddressOf, (err, res) => {
      if (err) {
        console.log("error: ", err);
        reject(err);
      }

      console.log("created new addressof translation: ", newAddressOf);
      resolve(newAddressOf)
    });
  });
};

module.exports = {
  Posting, Address, AddressOf
}
