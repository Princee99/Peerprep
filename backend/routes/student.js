const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const { pool } = require('../config/db'); // Adjust as needed

// Middleware to authenticate student (should set req.user.id)
const auth = require('../middleware/auth');

router.post('/reset-password', auth, async (req, res) => {
  const userId = req.user.userId;
  const { currentPassword, newPassword } = req.body;
  console.log(userId);
  try {
  // Get user from DB
  const userResult = await pool.query('SELECT password FROM users WHERE user_id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }
    const user = userResult.rows[0];

    // Compare current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

  // Update password in DB
  await pool.query('UPDATE users SET password = $1 WHERE user_id = $2', [hashedPassword, userId]);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Student reset-password error:', error);
    res.status(500).json({ message: 'Server error. Please try again.' });
  }
});

module.exports = router;