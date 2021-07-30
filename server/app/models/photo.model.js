const sql = require("./db.js");

// constructor
const Photo = function (photo) {
    this.posting_id = photo.posting_id;
    this.url = photo.photo_url;
};

Photo.create = newPhoto => {
    return new Promise((resolve, reject) => {
        sql.query("INSERT INTO PostingPhoto SET ?", newPhoto, (err, res) => {
            if (err) {
                console.log("error: ", err);
                reject(err);
            } else {
                console.log("Photo uploaded: ", { photo_id: res.insertId, ...newPhoto });
                resolve(res.insertId);
            }
        });
    });
}

Photo.getUrlsForPosting = (posting_id) => {
    return new Promise((resolve, reject) => {
        sql.query("SELECT * FROM PostingPhoto WHERE posting_id = ?", posting_id, (err, res) => {
            if (err) {
                console.log(err);
                reject(err);
            } else {
                resolve(res.map((ph) => ph.url));
            }
        });
    });
}

module.exports = Photo;
