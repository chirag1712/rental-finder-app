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
    this.ac = posting.ac;
    this.washrooms = posting.washrooms;
    this.wifi = posting.wifi;
    this.parking = posting.parking;
    this.laundry = posting.laundry;
    this.description = posting.description;
    this.created_at = posting.created_at;
    this.updated_at = posting.created_at;
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
                    // console.log("error: ", err);
                    reject(err);
                } else {
                    resolve(res[0]);
                }
            });
    });
}

Posting.getSinglePosting = getPosting => {
    const query = `SELECT p.*, a.*, ph.photo_id, ph.url
    FROM Posting AS p
    NATURAL JOIN AddressOf AS ao
    NATURAL JOIN Address AS a
    LEFT OUTER JOIN PostingPhoto AS ph
    ON p.posting_id = ph.posting_id
    NATURAL JOIN User AS u
    WHERE p.posting_id = 1;`;

    return new Promise((resolve, reject) => {
		sql.query(query, (err, res) => {
			if (err) reject(err);
			else resolve(res);
		});
	})
}

Posting.getPostings = filterInfo => {

    const { sort, term, rooms, gender, keywords, page } = filterInfo;

    let filter = 'WHERE ';
    if (term != null) filter += `FIND_IN_SET('${term}', term) > 0`;
    if (rooms != null) {
        if (filter.length > 6) filter += ' AND ';
        filter += `rooms_available = ${rooms}`;
    }
    if (gender != null) {
        if (filter.length > 6) filter += ' AND ';
        filter += `gender_details = '${gender}'`;
    }
    if (keywords != null && keywords !== '') {
        if (filter.length > 6) filter += ' AND ';
        filter += `MATCH (description) AGAINST('${keywords}') OR MATCH(street_num, street_name, building_name) AGAINST('${keywords}')`;
    }

    let sortStatement = 'updated_at DESC'
    if (sort === 'popularity') sortStatement = 'pop DESC';
    else if (sort === 'price') sortStatement = 'price_per_month ASC';

    const query =
        `SELECT posting_id AS id, price_per_month AS price, 
				CONCAT(street_num, " ", street_name, ", ",city) AS address
		FROM Posting NATURAL JOIN AddressOf NATURAL JOIN Address
		${filter.length > 6 ? filter : ''}
		ORDER BY ${sortStatement}
		LIMIT ${page * 20}, 21`;

    // console.log(query)

    return new Promise((resolve, reject) => {
        sql.query(query, (err, res) => {
            if (err) reject(err);
            else resolve(res);
        });
    })
};

Posting.create = newPosting => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO Posting SET ?", newPosting, (err, res) => {
            if (err) {
                // console.log("error: ", err);
                reject(err)
            } else {
                const createdPosting = { posting_id: res.insertId, ...newPosting }
                // console.log("created posting: ", createdPosting);
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
                // console.log("error: ", err);
                reject(err);
            } else {
                // console.log("address from db: ", res);
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
                // console.log("error: ", err);
                reject(err);
            } else {
                const createdAddress = { address_id: res.insertId, ...newAddress };
                // console.log("created address: ", createdAddress);
                resolve(createdAddress);
            }
        });
    });
};

AddressOf.create = newAddressOf => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO AddressOf SET ?", newAddressOf, (err, res) => {
            if (err) {
                // console.log("error: ", err);
                reject(err);
            }

            // console.log("created new addressof translation: ", newAddressOf);
            resolve(newAddressOf)
        });
    });
};

module.exports = {
    Posting, Address, AddressOf
}
