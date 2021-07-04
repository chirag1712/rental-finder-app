const dbConfig = require('../app/config/db.config.js');
const { createReadStream, createWriteStream } = require('fs');
const { spawn } = require('child_process');

exports.exec_sql_script = (path, args = []) => {
	console.log(`Executing ${path}`);
	return new Promise((resolve, reject) => {
		const mysql = spawn(
			process.env.MYSQL_PATH,
			[
				`--host=${dbConfig.HOST}`,
				`--user=${dbConfig.USER}`,
				`--password=${dbConfig.PASSWORD}`,
				...args
			]
		);
		const stream = createReadStream(path);
		stream.pipe(mysql.stdin);
		mysql.stdout.on('data', data => {
			console.log(`${data}`);
		});
		mysql.stderr.on('data', data => {
			console.error(`${data}`);
		});
		mysql.on('exit', (code, signal) => {
			resolve({ code, signal });
		});
	});
}

exports.dump = (path, args = []) => {
	console.log(`Dumping to ${path}`);
	return new Promise((resolve, reject) => {
		const mysqldump = spawn(
			process.env.MYSQLDUMP_PATH,
			[
				`--host=${dbConfig.HOST}`,
				`--user=${dbConfig.USER}`,
				`--password=${dbConfig.PASSWORD}`,
				dbConfig.DB,
				...args
			]
		);
		const stream = createWriteStream(path);
		mysqldump.stdout.pipe(stream);
		mysqldump.stderr.on('data', data => {
			console.error(`${data}`);
		});
		mysqldump.on('exit', (code, signal) => {
			resolve({ code, signal });
		});
	});
}
