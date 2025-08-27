const pool = require('../config/db');

// Get reviews for a company
const getReviews = async (req, res) => {
    try {
        const companyId = req.params.company_id;
        const result = await pool.query(
            'SELECT * FROM reviews WHERE company_id = $1 ORDER BY created_at DESC',
            [companyId]
        );
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch reviews' });
    }
};


module.exports = {
    getReviews
};