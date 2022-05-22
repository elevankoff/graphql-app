const mysql = require('mysql2');

let db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234qwer",
    multipleStatements: true
});

module.exports = { db };