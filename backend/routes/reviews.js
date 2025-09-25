const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const reviewController = require('../controllers/reviewController');

// Add a review for a company (only alumni)
router.post('/:companyId', auth, async (req, res) => {
    try {
        console.log('Review submission request:', {
            companyId: req.params.companyId,
            userId: req.user.userId,
            userRole: req.user.role,
            body: req.body
        });

        const { job_role, placement_type, offer_status } = req.body;
        const companyId = req.params.companyId;
        const userId = req.user.userId;
        const userRole = req.user.role;

        // Only alumni can add reviews
        if (userRole !== 'alumni') {
            return res.status(403).json({ error: 'Only alumni can add reviews.' });
        }

        // Validate required fields
        if (!job_role || !placement_type || !offer_status) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        // Validate placement_type and offer_status
        const validPlacementTypes = ['on-campus', 'off-campus'];
        const validOfferStatus = ['offer', 'no-offer'];
        if (!validPlacementTypes.includes(placement_type) || !validOfferStatus.includes(offer_status)) {
            return res.status(400).json({ error: 'Invalid placement type or offer status.' });
        }

        // Check if company exists
        const companyExists = await pool.query('SELECT * FROM companies WHERE company_id = $1', [companyId]);
        if (companyExists.rows.length === 0) {
            return res.status(404).json({ error: 'Company not found.' });
        }

        // Insert review
        const result = await pool.query(
            `INSERT INTO reviews (company_id, alumni_id, job_role, placement_type, offer_status)
             VALUES ($1, $2, $3, $4, $5) RETURNING *`,
            [companyId, userId, job_role, placement_type, offer_status]
        );

        console.log('Review created successfully:', result.rows[0]);
        res.status(201).json({ message: 'Review added successfully', review: result.rows[0] });
    } catch (err) {
        console.error('Database error:', err);
        res.status(500).json({ error: 'Failed to add review: ' + err.message });
    }
});

// Add a round to a review
router.post('/:reviewId/rounds', auth, async (req, res) => {
  const { reviewId } = req.params;
  const { round_type, description, tips } = req.body;
  
  // Add validation for reviewId
  if (!reviewId || isNaN(parseInt(reviewId))) {
    return res.status(400).json({ error: 'Invalid review ID' });
  }

  try {
    // Validate round_type
    const validRoundTypes = ['aptitude', 'technical', 'hr', 'other'];
    if (!validRoundTypes.includes(round_type)) {
        return res.status(400).json({ error: 'Invalid round type.' });
    }
    
    // Add this check to verify the review exists
    const reviewExists = await pool.query(
      'SELECT * FROM reviews WHERE review_id = $1',
      [parseInt(reviewId)]  // Convert to integer
    );
    
    if (reviewExists.rows.length === 0) {
      return res.status(404).json({ error: 'Review not found' });
    }
    
    const result = await pool.query(
      `INSERT INTO review_rounds (review_id, round_type, description, tips)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [parseInt(reviewId), round_type, description, tips]  // Convert to integer
    );
    
    res.json({ success: true, round: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit round review.' });
  }
});

// Get all rounds for a review
router.get('/:reviewId/rounds', async (req, res) => {
    const { reviewId } = req.params;
    try {
        const result = await pool.query(
            `SELECT * FROM review_rounds WHERE review_id = $1 ORDER BY round_id ASC`,
            [reviewId]
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Get reviews for a company
router.get('/:company_id', reviewController.getReviews);

module.exports = router;
