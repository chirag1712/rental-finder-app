const sql = require("./db.js");

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
  this.created_at = Date.now();
  this.updated_at = Date.now();
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
Posting.userCheck = (user_id, result) => {
  sql.query(
    "SELECT * FROM User WHERE user_id = ?",
    user_id,
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
      if (res[0]) {
        result(null, true);
        console.log("User exists");
        return;
      } else {
        console.log("User doesnt exists");
        result(null, false);
        return;
      }
    }
  );
};

Posting.create = (newPosting, result) => {
  sql.query("INSERT INTO Posting SET ?", newPosting, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created posting: ", {
      posting_id: res.insertId,
      ...newPosting,
    });
    result(null, { posting_id: res.insertId, ...newPosting });
  });
};

Address.createAddress = (newAddress, result) => {
  sql.query("INSERT INTO Address SET ?", newAddress, (err, res) => {
    if (err) {
      console.log(newAddress)
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created address: ", {
      address_id: res.insertId,
      ...newAddress,
    });
    result(null, { address_id: res.insertId, ...newAddress });
  });
};

AddressOf.createAddressOf = (newAddressOf, result) => {
  sql.query("INSERT INTO AddressOf SET ?", newAddressOf, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created new addressof translation: ", {
      ...newAddressOf,
    });
    result(null, true);
  });
};

Address.search = (address, result) => {
  sql.query(
    "SELECT * FROM Address WHERE street_num = " +
      address.street_num +
      " AND street_name = \"" +
      address.street_name + "\"",
    (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }

      console.log("address found: ", res);
      result(null, res);
    }
  );
};

module.exports = {
  Posting, Address, AddressOf
}
