const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'mysql.dachery.com.br',
    user: 'dachery01',
    password: 'Madafock11',
    database: 'dachery01',
    connectionLimit: 10
});

module.exports = connection