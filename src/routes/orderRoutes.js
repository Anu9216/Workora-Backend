const express = require('express');
const router = express.Router();
const { createPaymentIntent, getOrders, createOrder, updateOrderStatus } = require('../controllers/orderController');
const checkAuth = require('../middleware/checkAuth');

router.use((req, res, next) => {
    console.log("ORDER_ROUTE: Request received at", req.originalUrl);
    next();
});

router.use(checkAuth);

router.post('/create-payment-intent', createPaymentIntent);
router.post('/', createOrder); // Added for completeness to store the order
router.get('/', getOrders);
router.patch('/:id', updateOrderStatus);

module.exports = router;
