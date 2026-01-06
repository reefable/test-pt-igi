const mysql = require('mysql2/promise');
require('dotenv').config();

// Create a connection pool to handle multiple concurrent connections
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
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
    .catch(async err => {
        // Handle specific ER_BAD_DB_ERROR (Error code 1049) if needed
        if (err.code === 'ER_BAD_DB_ERROR') {
            await initDB();
        }
        console.error('DB error:', err.code);
    });

const initDB = async () => {
    let conn;

    try {
        // Connect without database first to create it
        conn = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || 'root',
        });

        console.log('🔌 Connected to MySQL server');

        // Create database if not exists
        await conn.query(`CREATE DATABASE IF NOT EXISTS simple_order`);
        console.log(`📦 Database simple_order ready`);

        // Switch to the database
        await conn.query(`USE simple_order`);

        // Create users table
        await conn.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL, -- In production, hash this!
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('👤 Users table created');

        // Create products table
        await conn.query(`
    CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        price DECIMAL(10, 2) NOT NULL,
        stock INT NOT NULL DEFAULT 0
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('📦 Products table created');

        // Create orders table
        await conn.query(`
    CREATE TABLE IF NOT EXISTS orders (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantity INT NOT NULL,
        total_price DECIMAL(10, 2) NOT NULL,
        order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (product_id) REFERENCES products(id)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);
        console.log('🛒 Orders table created');

        // Insert demo user
        await conn.query(`INSERT INTO users (username, password) VALUES ('admin', 'password123')`);
        console.log('👤 Demo user created (username: demo, password: password123)');

        // Insert sample products
        await conn.query(`
    INSERT INTO products (name, price, stock) VALUES
        ('Laptop', 1200.00, 10),
        ('Headphones', 150.00, 50),
        ('Keyboard', 85.00, 30)
    `);
        console.log(`📦 products sample products inserted`);

        console.log('\n✅ Database initialization complete!\n');
    }
    catch (error) {
        console.error('❌ Database initialization failed:', error.message);
        process.exit(1);
    } finally {
        if (connection) {
            await connection.end();
        }
    }
};

module.exports = pool;
