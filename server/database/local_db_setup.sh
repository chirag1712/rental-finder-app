#!/bin/bash
./mysql_local.sh < migrations/create_db.sql
./mysql_local.sh < migrations/create_tables.sql