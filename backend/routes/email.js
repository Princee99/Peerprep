const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const bcrypt = require('bcryptjs');
const { sendCredentialEmail } = require('../utils/emailService');
const { readPasswordsFromExcel, getPasswordFromExcel } = require('../utils/excel_to_sendInMail');
const path = require('path');

// Send email to users with Charusat domain
router.post('/send-credentials', auth, isAdmin, async (req, res) => {
    try {
        const { userType, excelFilePath } = req.body;
        
        // Check if Excel file path is provided
        if (!excelFilePath) {
            return res.status(400).json({ message: "Excel file path is required" });
        }

        // Read all passwords from Excel at once
        const passwordMap = readPasswordsFromExcel(excelFilePath);
        
        if (Object.keys(passwordMap).length === 0) {
            return res.status(400).json({ message: "No passwords found in Excel file or file not accessible" });
        }
        
        let query = "SELECT user_id, email, password, role FROM users WHERE email LIKE '%@charusat.edu.in'";
        let queryParams = [];
        
        if (userType === 'alumni') {
            query += " AND role = 'alumni'";
        } else if (userType === 'student') {
            query += " AND role = 'student'";
        } else if (userType === 'both') {
            query += " AND (role = 'alumni' OR role = 'student')";
        } else {
            query += " AND (role = 'alumni' OR role = 'student')";
        }
        
        const users = await pool.query(query, queryParams);
        
        if (users.rows.length === 0) {
            return res.status(404).json({ message: "No alumni or student users found with Charusat email addresses" });
        }

        const emailResults = [];
        let excelFoundCount = 0;
        let notFoundCount = 0;
        
        // Process each user
        for (const user of users.rows) {
            // Get password from Excel using the existing function
            const plainPassword = getPasswordFromExcel(user.email, excelFilePath);
            
            if (!plainPassword) {
                notFoundCount++;
                emailResults.push({
                    email: user.email,
                    role: user.role,
                    success: false,
                    error: `Password not found in Excel file for ${user.email}`,
                    source: 'not_found'
                });
                continue;
            }
            
            excelFoundCount++;
            
            // Hash the password for database storage
            const hashedPassword = await bcrypt.hash(plainPassword, 10);
            
            // Update user's password in database
            await pool.query(
                "UPDATE users SET password = $1 WHERE user_id = $2",
                [hashedPassword, user.user_id]
            );
            
            console.log(`Using Excel password for ${user.email}`);
            
            // Send email with plain text password from Excel
            const result = await sendCredentialEmail(user.email, plainPassword, user.role);
            emailResults.push({
                email: user.email,
                role: user.role,
                success: result.success,
                error: result.error || null,
                source: 'excel'
            });
        }

        const successCount = emailResults.filter(r => r.success).length;
        const failCount = emailResults.filter(r => !r.success).length;
        const alumniCount = emailResults.filter(r => r.role === 'alumni').length;
        const studentCount = emailResults.filter(r => r.role === 'student').length;

        res.json({
            message: `Email sending completed. Success: ${successCount}, Failed: ${failCount}`,
            summary: {
                total: users.rows.length,
                alumni: alumniCount,
                students: studentCount,
                successful: successCount,
                failed: failCount,
                excelFound: excelFoundCount,
                notFound: notFoundCount
            },
            results: emailResults.map(r => ({
                email: r.email,
                role: r.role,
                success: r.success,
                error: r.error,
                source: r.source
            }))
        });

    } catch (err) {
        console.error('Error sending credential emails:', err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Send email to specific user
router.post('/send-credentials/:userId', auth, isAdmin, async (req, res) => {
    try {
        const { userId } = req.params;
        const { excelFilePath } = req.body;
        
        if (!excelFilePath) {
            return res.status(400).json({ message: "Excel file path is required" });
        }
        
        const user = await pool.query(
            "SELECT user_id, email, password, role FROM users WHERE user_id = $1 AND email LIKE '%@charusat.edu.in' AND (role = 'alumni' OR role = 'student')",
            [userId]
        );

        if (user.rows.length === 0) {
            return res.status(404).json({ message: "Alumni/Student user not found or doesn't have Charusat email" });
        }

        const userData = user.rows[0];
        
        // Get password from Excel using existing function
        const plainPassword = getPasswordFromExcel(userData.email, excelFilePath);
        
        if (!plainPassword) {
            return res.status(400).json({ 
                message: "Password not found in Excel file for this user",
                email: userData.email
            });
        }
        
        // Hash and update password
        const hashedPassword = await bcrypt.hash(plainPassword, 10);
        await pool.query(
            "UPDATE users SET password = $1 WHERE user_id = $2",
            [hashedPassword, userData.user_id]
        );

        const result = await sendCredentialEmail(userData.email, plainPassword, userData.role);

        if (result.success) {
            res.json({ 
                message: "Credential email sent successfully",
                email: userData.email,
                role: userData.role,
                source: 'excel'
            });
        } else {
            res.status(500).json({ 
                message: "Failed to send email",
                error: result.error
            });
        }

    } catch (err) {
        console.error('Error sending credential email:', err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;