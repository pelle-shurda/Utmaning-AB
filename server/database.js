const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'nora_deli'
});

db.connect((err) => {
    if (err) {
        console.error('Databasfel:', err);
        return;
    }
    console.log('Ansluten till MySQL!');
});

module.exports = db;