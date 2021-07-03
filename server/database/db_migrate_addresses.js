const mysql = require('mysql');
const dbConfig = require("../app/config/db.config.js");

const backupCon = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: 'honkForSubletBackup',
  charset: 'utf8mb4_unicode_ci'
});

const mainCon = mysql.createConnection({
  host: dbConfig.HOST,
  user: dbConfig.USER,
  password: dbConfig.PASSWORD,
  database: dbConfig.DB,
  charset: 'utf8mb4_unicode_ci'
});

(async () => {
  try {
    const addresses = await new Promise((resolve, reject) => {
      backupCon.connect();
      backupCon.query(`SELECT * FROM Address`, (err, res) => {
        if (err) reject(err);
        else resolve(res);
      });
      backupCon.end();
    });
    console.log(`Found ${addresses.length} entries in honkForSubletBackup.Address`);
    mainCon.connect();
    for (const address of addresses) {
      await new Promise((resolve, reject) => {
        mainCon.query(`INSERT INTO Address SET ?`, address, (err, res) => {
          if (err) reject(err);
          else resolve(res);
        });
      });
    }
    mainCon.end();
    console.log(`Migrated ${addresses.length} entries into ${dbConfig.DB}.Address`);
  } catch (error) {
    console.error(error);
  }
})();