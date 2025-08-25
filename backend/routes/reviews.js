const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Add a review (alumni only, add auth middleware as needed)
router.post('/', reviewController.addReview);

// Get reviews for a company
router.get('/:company_id', reviewController.getReviews);

module.exports = router;
