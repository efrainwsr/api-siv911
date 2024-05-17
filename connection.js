const mysql = require('mysql2/promise');
require('dotenv').config()


const conn = mysql.createPool({
  host: 'localhost',
  user: process.env.USER,
  password: process.env.PASSWROD,
  database: process.env.DBNAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = conn;