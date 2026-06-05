const mysql = require('mysql2');

console.log('--- DEBUG DE VARIABLES ---');
console.log('Host:', process.env.DB_HOST);
console.log('User:', process.env.DB_USER);
console.log('Password:', process.env.DB_PASSWORD);
console.log('Database:', process.env.DB_DATABASE);
console.log('--------------------------');

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