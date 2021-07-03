const https = require('https');
const querystring = require('querystring');
const sql = require('../app/models/db.js');

function getPostalCodeAPI(street_num, street_name, city, myConsole = console) {
  return new Promise((resolve, reject) => {
    const parameters = { query: `${street_num} ${street_name}, ${city}` };
      const options = {
        hostname: 'canadapostalcode.net',
        port: 443,
        path: `/search?${querystring.stringify(parameters)}`,
        method: 'GET'
      };
      myConsole.log(`${options.method} ${options.hostname}${options.path}`);
      const req = https.request(options, res => {
        const all_chunks = [];
        res.on('data', chunk => {
          all_chunks.push(chunk);
        });
        res.on('end', () => {
          try {
            const body = Buffer.concat(all_chunks).toString();
            myConsole.log(
              `RETURNED STATUS ${res.statusCode}\nHEADERS:`,
              res.headers,
              '\nBODY:\n',
              body
            );
            resolve(JSON.parse(body).data[0].postal_code.replace(/ /g, ''));
          } catch (err) {
            reject(err);
          }
        });
      }).end();
    });
}

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
exports.getPostalCodeAPI = getPostalCodeAPI;