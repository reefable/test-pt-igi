const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const verifyToken = require('../middlewares/authMiddleware');

// All order routes require authentication
router.use(verifyToken);

// POST /api/orders
router.post('/', orderController.createOrder);

// GET /api/orders
router.get('/', orderController.getOrders);

module.exports = router;