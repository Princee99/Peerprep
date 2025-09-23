const express = require('express');
const router = express.Router();
const db = require('../config/db');
const auth = require('../middleware/auth');

// GET /api/profile - Get user profile
router.get('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const query = `
      SELECT 
        user_id,
        email,
        role,
        name,
        phone,
        department,
        college_name,
        graduation_year,
        current_company,
        designation,
        bio,
        created_at
      FROM users 
      WHERE user_id = $1
    `;

    const result = await db.query(query, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = result.rows[0];

    res.json({
      success: true,
      user: user
    });

  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// PUT /api/profile - Update user profile
router.put('/', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const {
      name,
      phone,
      department,
      college_name,
      graduation_year,
      current_company,
      designation,
      bio
    } = req.body;

    // Validation
    const errors = [];
    
    if (name && (name.trim().length < 2 || name.trim().length > 255)) {
      errors.push('Name must be between 2 and 255 characters');
    }
    
    if (phone && phone.trim() && !/^\+?[\d\s\-\(\)]{10,}$/.test(phone.replace(/\s/g, ''))) {
      errors.push('Invalid phone number format');
    }
    
    if (graduation_year && (graduation_year < 2000 || graduation_year > 2030)) {
      errors.push('Graduation year must be between 2000 and 2030');
    }

    if (college_name && college_name.trim().length > 255) {
      errors.push('College name cannot exceed 255 characters');
    }

    if (current_company && current_company.trim().length > 255) {
      errors.push('Company name cannot exceed 255 characters');
    }

    if (designation && designation.trim().length > 255) {
      errors.push('Designation cannot exceed 255 characters');
    }

    if (errors.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors
      });
    }

    const updateQuery = `
      UPDATE users 
      SET 
        name = COALESCE(NULLIF($2, ''), name),
        phone = COALESCE(NULLIF($3, ''), phone),
        department = COALESCE(NULLIF($4, ''), department),
        college_name = COALESCE(NULLIF($5, ''), college_name),
        graduation_year = COALESCE($6, graduation_year),
        current_company = COALESCE(NULLIF($7, ''), current_company),
        designation = COALESCE(NULLIF($8, ''), designation),
        bio = COALESCE(NULLIF($9, ''), bio)
      WHERE user_id = $1
      RETURNING 
        user_id,
        email,
        role,
        name,
        phone,
        department,
        college_name,
        graduation_year,
        current_company,
        designation,
        bio,
        created_at
    `;

    const result = await db.query(updateQuery, [
      userId,
      name?.trim() || null,
      phone?.trim() || null,
      department?.trim() || null,
      college_name?.trim() || null,
      graduation_year || null,
      current_company?.trim() || null,
      designation?.trim() || null,
      bio?.trim() || null
    ]);

    const updatedUser = result.rows[0];

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Error updating user profile:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// GET /api/profile/stats - Get user stats (for future use)
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    const userRole = req.user.role;

    let stats = {};

    if (userRole === 'alumni') {
      // Get review count for alumni
      const reviewCountQuery = 'SELECT COUNT(*) as count FROM reviews WHERE alumni_id = $1';
      const reviewResult = await db.query(reviewCountQuery, [userId]);
      stats.reviewsGiven = parseInt(reviewResult.rows[0].count);

      // Get companies reviewed
      const companiesQuery = `
        SELECT COUNT(DISTINCT company_id) as count 
        FROM reviews 
        WHERE alumni_id = $1
      `;
      const companiesResult = await db.query(companiesQuery, [userId]);
      stats.companiesReviewed = parseInt(companiesResult.rows[0].count);
    }

    if (userRole === 'student') {
      // Get questions asked count
      const questionsQuery = 'SELECT COUNT(*) as count FROM questions WHERE student_id = $1';
      const questionsResult = await db.query(questionsQuery, [userId]);
      stats.questionsAsked = parseInt(questionsResult.rows[0].count);
    }

    res.json({
      success: true,
      stats
    });

  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;