const { exec_sql_script } = require('./db_helper.js');

if (process.argv.length != 3) {
    console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <file_path>`);
} else {
    exec_sql_script('database/migrations/drop_db.sql')
    .then(() => exec_sql_script('database/migrations/create_db.sql'))
    .then(() => exec_sql_script(process.argv[2], [process.env.DB_NAME]));
}