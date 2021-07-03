const { dump } = require('./db_helper.js');
const { exec_sql_script } = require('./db_helper.js');

(async () => {
  try {
    await dump('database/migrations/backup_dump.sql');
    await exec_sql_script('database/migrations/drop_backup_db.sql');
    await exec_sql_script('database/migrations/create_backup_db.sql');
    await exec_sql_script('database/migrations/backup_dump.sql', ['honkForSubletBackup']);
  } catch (error) {
    console.error(error);
  }
})();