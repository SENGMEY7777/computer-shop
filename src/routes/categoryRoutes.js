const express = require('express');
const { getCategories, addCategory, editCategory, removeCategory } = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getCategories);
router.post('/', protect, adminOnly, addCategory);
router.put('/:id', protect, adminOnly, editCategory);
router.delete('/:id', protect, adminOnly, removeCategory);

module.exports = router;
