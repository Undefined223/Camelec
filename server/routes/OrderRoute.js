const express = require('express');
const router = express.Router();
const { createOrder, getOrdersByUser, getOrders, updateOrderStatus } = require('../controllers/OrderController');
const { adminOrOwner, protect, admin } = require('../middleware/AdminMiddleware');

router.post('/', createOrder);
router.get('/:userId', protect, adminOrOwner, getOrdersByUser);
router.get('/', protect, admin, getOrders);
router.put('/:orderId/status', protect, admin, updateOrderStatus);


module.exports = router;
