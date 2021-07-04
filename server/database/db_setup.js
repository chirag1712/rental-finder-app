const { exec_sql_script } = require('./db_helper.js');

(async () => {
  try {
    await exec_sql_script('database/migrations/drop_db.sql');
    await exec_sql_script('database/migrations/create_db.sql');
    await exec_sql_script('database/migrations/create_tables.sql');
    await exec_sql_script('database/migrations/create_indices.sql');
    await exec_sql_script('database/migrations/create_triggers.sql');
  } catch (error) {
    console.error(error);
  }
})();
