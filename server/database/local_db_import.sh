#!/bin/bash

if [ $# -ne 1 ]; then
    echo "Usage: $0 <dump_path>"
    exit 1
fi

./mysql_local.sh < migrations/drop_db.sql
./mysql_local.sh < migrations/create_db.sql
./mysql_local.sh honkForSublet < "$1"