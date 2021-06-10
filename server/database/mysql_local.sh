#!/bin/bash
mysql='/usr/local/mysql/bin/mysql'
MYSQL_HOST='localhost'
MYSQL_ROOT='root'
MYSQL_PASS='admin123'
"$mysql" -h "$MYSQL_HOST" -u "$MYSQL_ROOT" -p"$MYSQL_PASS" "$@"