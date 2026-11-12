const { getReviewsByComputerId, createReview, getReviewById, deleteReview } = require('../models/reviewModel');
const { getComputerById } = require('../models/computerModel');

const getReviews = (req, res) => {
  try {
    const reviews = getReviewsByComputerId(req.params.id);
    res.status(200).json({ success: true, message: 'Reviews retrieved', data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const addReview = (req, res) => {
  try {
    const computerId = req.params.id;
    const { rating, comment } = req.body;
    if (!rating || !comment) {
      return res.status(400).json({ success: false, message: 'Rating and comment are required' });
    }
    const computer = getComputerById(computerId);
    if (!computer) return res.status(404).json({ success: false, message: 'Computer not found' });

    const newReview = createReview({
      computerId,
      userId: req.user.id,
      userName: req.user.name,
      rating,
      comment
    });

    res.status(201).json({ success: true, message: 'Review added successfully', data: newReview });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const removeReview = (req, res) => {
  try {
    const review = getReviewById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    if (req.user.role !== 'admin' && review.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    deleteReview(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getReviews, addReview, removeReview };
