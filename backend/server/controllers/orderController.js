const db = require('../config/db');
const { orderSchema } = require('../utils/validation');

exports.createOrder = async (req, res) => {
    // 1. Validate Input
    const { error } = orderSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { product_id, quantity } = req.body;
    const userId = req.user.id; // From Auth Middleware

    const connection = await db.getConnection();

    try {
        // Start Transaction
        await connection.beginTransaction();

        // 2. Check Stock (Lock row with FOR UPDATE to prevent race conditions)
        const [products] = await connection.query(
            'SELECT price, stock FROM products WHERE id = ? FOR UPDATE', 
            [product_id]
        );

        if (products.length === 0) {
            throw new Error('Product tidak ada');
        }

        const product = products[0];

        if (product.stock < quantity) {
            throw new Error(`Stock tidak cukup. Sisa ${product.stock} barang.`);
        }

        // 3. Deduct Stock
        await connection.query(
            'UPDATE products SET stock = stock - ? WHERE id = ?', 
            [quantity, product_id]
        );

        // 4. Create Order Record
        const totalPrice = product.price * quantity;
        const [result] = await connection.query(
            'INSERT INTO orders (user_id, product_id, quantity, total_price) VALUES (?, ?, ?, ?)',
            [userId, product_id, quantity, totalPrice]
        );

        // Commit Transaction
        await connection.commit();

        res.status(201).json({ 
            message: 'Order berhasil', 
            orderId: result.insertId,
            totalPrice 
        });

    } catch (err) {
        // Rollback on any error
        await connection.rollback();
        const statusCode = err.message.includes('Insufficient') || err.message.includes('Product') ? 400 : 500;
        res.status(statusCode).json({ error: err.message });
    } finally {
        connection.release();
    }
};

exports.getOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        
        // Join with products table to get product name
        const query = `
            SELECT o.id, p.name as product_name, o.quantity, o.total_price, o.order_date
            FROM orders o
            JOIN products p ON o.product_id = p.id
            WHERE o.user_id = ?
            ORDER BY o.order_date DESC
        `;
        
        const [orders] = await db.query(query, [userId]);
        res.json(orders);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal mengambil riwayat order' });
    }
};