const https = require('https');
const querystring = require('querystring');
const sql = require('../app/models/db.js');
const { getPostalCodeAPI } = require('../app/controllers/address.controller');

(async () => {
  const addressList = await new Promise((resolve, reject) => {
    sql.query(`SELECT * FROM Address WHERE postal_code IS NULL`, (err, res) => {
      if (err) reject(err);
      else resolve(res);
    });
  });
  for (const address of addressList) {
    try {
      const postal_code = await getPostalCodeAPI(
        address.street_num, address.street_name, address.city
      );
      await new Promise((resolve, reject) => {
        const statement = `UPDATE Address SET postal_code = ? WHERE address_id = ?`;
        sql.query(statement, [postal_code, address.address_id], (err, res) => {
          if (err) reject(err);
          else resolve(res);
        })
      });
    } catch (error) {
      console.error(error);
    }
  }
})();

exports.sql = sql;