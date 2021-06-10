#!/bin/bash
mysqldump='/usr/local/mysql/bin/mysqldump'
MYSQL_HOST='localhost'
MYSQL_ROOT='root'
MYSQL_PASS='admin123'
"$mysqldump" -h "$MYSQL_HOST" -u "$MYSQL_ROOT" -p"$MYSQL_PASS" honkForSublet > migrations/local_dump.sql