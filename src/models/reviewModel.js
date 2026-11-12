const { readJSON, writeJSON } = require('../config/storage');
const crypto = require('crypto');

const FILE = 'reviews.json';

const getAllReviews = () => readJSON(FILE);
const getReviewsByComputerId = (computerId) => getAllReviews().filter(r => r.computerId === computerId);
const getReviewById = (id) => getAllReviews().find(r => r.id === id);

const createReview = (data) => {
  const reviews = getAllReviews();
  const newReview = {
    id: crypto.randomUUID(),
    computerId: data.computerId,
    userId: data.userId,
    userName: data.userName,
    rating: Number(data.rating),
    comment: data.comment,
    createdAt: new Date().toISOString()
  };
  reviews.push(newReview);
  writeJSON(FILE, reviews);
  return newReview;
};

const deleteReview = (id) => {
  let reviews = getAllReviews();
  const idx = reviews.findIndex(r => r.id === id);
  if (idx === -1) return false;
  reviews = reviews.filter(r => r.id !== id);
  writeJSON(FILE, reviews);
  return true;
};

module.exports = { getAllReviews, getReviewsByComputerId, getReviewById, createReview, deleteReview };
