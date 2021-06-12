require('dotenv').config();
const { createReadStream, createWriteStream } = require('fs');
const { spawn } = require('child_process');

exports.exec_sql_script = (path, args=[]) => {
    return new Promise((resolve, reject) => {
        const mysql = spawn(
            process.env.MYSQL_PATH,
            [
                `--host=${process.env.DB_HOST}`,
                `--user=${process.env.DB_USER}`,
                `--password=${process.env.DB_PASSWORD}`,
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

exports.dump = (path, args=[]) => {
    return new Promise((resolve, reject) => {
        const mysqldump = spawn(
            process.env.MYSQLDUMP_PATH,
            [
                `--host=${process.env.DB_HOST}`,
                `--user=${process.env.DB_USER}`,
                `--password=${process.env.DB_PASSWORD}`,
                process.env.DB_NAME,
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