const db = require('../config/db');

exports.getProducts = async (req, res) => {
    try {
        const [products] = await db.query('SELECT id, name, price, stock FROM products');
        res.json(products);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Gagal mengambil produk' });
    }
};