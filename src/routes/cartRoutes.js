const express = require('express');
const { getCart, addItemToCart, updateCartItem, removeCartItem, emptyCart } = require('../controllers/cartController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getCart);
router.post('/items', addItemToCart);
router.patch('/items/:computerId', updateCartItem);
router.delete('/items/:computerId', removeCartItem);
router.delete('/', emptyCart);

module.exports = router;
