const express = require('express');
const { checkout, getOrders, getOrderDetails, changeOrderStatus, getOrderStats } = require('../controllers/orderController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/stats/summary', adminOnly, getOrderStats);
router.post('/', checkout);
router.get('/', getOrders);
router.get('/:id', getOrderDetails);
router.patch('/:id/status', adminOnly, changeOrderStatus);

module.exports = router;
