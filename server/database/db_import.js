const { exec_sql_script } = require('./db_helper.js');
const { DB } = require('../app/config/db.config.js');

if (process.argv.length != 3) {
  console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <file_path>`);
} else {
  (async () => {
    try {
      await exec_sql_script('database/migrations/drop_db.sql');
      await exec_sql_script('database/migrations/create_db.sql');
      await exec_sql_script(process.argv[2], [DB]);
    } catch (error) {
      console.error(error);
    }
  })();
}