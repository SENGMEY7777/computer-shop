const express = require('express');
const { getComputers, getComputerDetails, addComputer, editComputer, updateStock, removeComputer } = require('../controllers/computerController');
const { getReviews, addReview } = require('../controllers/reviewController');
const { protect, adminOnly } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', getComputers);
router.get('/:id', getComputerDetails);
router.post('/', protect, adminOnly, addComputer);
router.put('/:id', protect, adminOnly, editComputer);
router.patch('/:id/stock', protect, adminOnly, updateStock);
router.delete('/:id', protect, adminOnly, removeComputer);

// Reviews nested
router.get('/:id/reviews', getReviews);
router.post('/:id/reviews', protect, addReview);

module.exports = router;
