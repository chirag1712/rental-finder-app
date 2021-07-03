const { exec_sql_script } = require('./db_helper.js');

if (process.argv.length != 3) {
  console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <file_path>`);
} else {
  (async () => {
    try {
      await exec_sql_script(process.argv[2]);
    } catch (error) {
      console.error(error);
    }
  })();
}