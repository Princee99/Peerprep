const express = require('express');
const router = express.Router();
const { pool } = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/stats/overview - basic platform-wide counts
router.get('/overview', auth, async (req, res) => {
  try {
    const client = await pool.connect();
    try {
      const [companiesRes, reviewsRes, questionsRes, answersRes, studentsRes, alumniRes] = await Promise.all([
        client.query('SELECT COUNT(*)::int AS count FROM companies'),
        client.query('SELECT COUNT(*)::int AS count FROM reviews'),
        client.query('SELECT COUNT(*)::int AS count FROM questions'),
        client.query('SELECT COUNT(*)::int AS count FROM answers'),
        client.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'student'"),
        client.query("SELECT COUNT(*)::int AS count FROM users WHERE role = 'alumni'")
      ]);

      res.json({
        totalCompanies: companiesRes.rows[0].count,
        totalReviews: reviewsRes.rows[0].count,
        totalQuestions: questionsRes.rows[0].count,
        totalAnswers: answersRes.rows[0].count,
        totalStudents: studentsRes.rows[0].count,
        totalAlumni: alumniRes.rows[0].count
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('Error fetching overview stats:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;


