const { exec_sql_script } = require('./db_helper.js');

exec_sql_script('database/migrations/drop_db.sql')
.then(() => exec_sql_script('database/migrations/create_db.sql'))
.then(() => exec_sql_script('database/migrations/create_tables.sql'));