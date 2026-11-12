const express = require('express');
const { removeReview } = require('../controllers/reviewController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.delete('/:id', protect, removeReview);

module.exports = router;
