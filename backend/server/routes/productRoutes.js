const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const verifyToken = require('../middlewares/authMiddleware');

// GET /api/products
// Optional: Add verifyToken if you want products to be private
router.get('/', verifyToken, productController.getProducts);

module.exports = router;