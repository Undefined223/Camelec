const express = require('express');
const router = express.Router();
const { createOrder, getOrdersByUser, getOrders, updateOrderStatus, getPendingOrders, OrderDeliverySubmit } = require('../controllers/OrderController');
const { adminOrOwner, protect, admin } = require('../middleware/AdminMiddleware');

router.post('/', createOrder);
router.get('/user/:userId', protect, adminOrOwner, getOrdersByUser);
router.get('/', protect, admin, getOrders);
router.get('/pending', protect, admin, getPendingOrders);
router.post('/submit', protect, admin, OrderDeliverySubmit);
router.put('/:orderId/status', protect, admin, updateOrderStatus);


module.exports = router;
