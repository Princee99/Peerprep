const router = require('express').Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if user exists
        const user = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (user.rows.length === 0) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.rows[0].password);
        if (!validPassword) {
            return res.status(401).json({ message: "Invalid Credentials" });
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                user_id: user.rows[0].user_id,
                role: user.rows[0].role
            },
            process.env.token,
            { expiresIn: "7d" } // Extended to 7 days for better user experience
        );

        res.json({ 
            token,
            user: {
                user_id: user.rows[0].user_id,
                email: user.rows[0].email,
                role: user.rows[0].role
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Add this route to get current user details with all fields
router.get('/me', auth, async (req, res) => {
  try {
    const userId = req.user.user_id; // Changed from userId to user_id for consistency

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

    const result = await pool.query(query, [userId]);

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
    console.error('Error fetching user details:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Reset password for logged-in users (authenticated password change)
router.post('/reset-password-auth', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.user_id;

    // Validate request
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    // Get user from database
    const userResult = await pool.query(
      'SELECT * FROM users WHERE user_id = $1',
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = userResult.rows[0];

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update password in database
    await pool.query(
      'UPDATE users SET password = $1 WHERE user_id = $2',
      [hashedPassword, userId]
    );

    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;