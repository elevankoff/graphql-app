#!/usr/bin/env bash

/etc/init.d/mysql start
mysql --execute="ALTER USER 'root'@'localhost' IDENTIFIED BY '1234qwer';"
node ./server/server.js