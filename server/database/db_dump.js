const { dump } = require('./db_helper.js');

if (process.argv.length != 3) {
  console.error(`Usage: ${process.argv[0]} ${process.argv[1]} <file_path>`);
} else {
  (async () => {
    try {
      await dump(process.argv[2]);
    } catch (error) {
      console.error(error);
    }
  })();
}