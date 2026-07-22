const mysql = require('mysql2/promise');

const connection = mysql.createConnection({
    host: process.env.DB_HOST, 
    user: process.env.DB_USER, 
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT || 3306
});

connection.connect((err) => {
    if(err) {
        console.error('Error connecting to the database', err);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = connection;