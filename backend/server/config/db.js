const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool to handle multiple concurrent connections
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'user',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'simple_order',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test connection on startup
pool.getConnection()
    .then(conn => {
        console.log('Terhubung dengan DB');
        conn.release();
    })
    .catch(err => {
        console.error('DB error:', err.message);
    });

module.exports = pool;