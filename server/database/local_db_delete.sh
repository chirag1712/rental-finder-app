#!/bin/bash
./mysql_local.sh < migrations/drop_tables.sql
./mysql_local.sh < migrations/drop_db.sql