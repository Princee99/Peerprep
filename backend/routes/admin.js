const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const multer = require('multer');
const XLSX = require('xlsx');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');
const execAsync = promisify(exec);

// Import your existing email service
const { sendCredentialEmail } = require('../utils/emailService');

// Configure multer for Excel file uploads
const upload = multer({
  dest: 'uploads/temp/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.mimetype === 'application/vnd.ms-excel') {
      cb(null, true);
    } else {
      cb(new Error('Only Excel files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  }
});

// Admin middleware
const adminAuth = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};

// Download Excel template - FIXED to match your database schema
router.get('/download-template', auth, adminAuth, (req, res) => {
  try {
    // Create template matching your database schema
    const templateData = [
      ['user_id', 'email', 'role', 'name', 'phone', 'department', 'college_name', 'graduation_year', 'current_company', 'designation'],
      ['22CE094', '22ce094@charusat.edu.in', 'student', 'John Doe', '9876543210', 'Computer Engineering', 'CHARUSAT', '2026', '', ''],
      ['22IT117', '22it117@charusat.edu.in', 'alumni', 'Jane Smith', '9876543211', 'Information Technology', 'CHARUSAT', '2024', 'Tech Corp', 'Software Engineer'],
      ['D22CE089', 'd22ce089@charusat.edu.in', 'student', 'Bob Wilson', '9876543212', 'Computer Engineering', 'CHARUSAT', '2026', '', '']
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(templateData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    
    const tempDir = path.join(__dirname, '../temp');
    const tempPath = path.join(tempDir, 'user-template.xlsx');
    
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    XLSX.writeFile(wb, tempPath);
    res.download(tempPath, 'user-template.xlsx', (err) => {
      if (!err) {
        // Clean up temp file after download
        setTimeout(() => {
          if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
          }
        }, 5000);
      }
    });
  } catch (error) {
    console.error('Template download error:', error);
    res.status(500).json({ success: false, message: 'Failed to download template' });
  }
});

// Generate passwords and automatically send emails - FIXED
router.post('/generate-passwords', auth, adminAuth, upload.single('excelFile'), async (req, res) => {
  try {
    console.log('📁 Starting password generation process...');
    
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        message: 'No file uploaded' 
      });
    }

    console.log('📁 Processing uploaded file:', req.file.originalname);

    const uploadedFilePath = req.file.path;
    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const dataDir = path.join(__dirname, '../data');
    
    // Ensure data directory exists
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // Copy uploaded file to data directory with timestamp
    const inputFileName = `input_${timestamp}_${req.file.originalname}`;
    const inputFilePath = path.join(dataDir, inputFileName);
    fs.copyFileSync(uploadedFilePath, inputFilePath);

    // Clean up temp file
    fs.unlinkSync(uploadedFilePath);

    console.log('🔄 Starting password generation for file:', inputFilePath);

    // Run password generation script
    const scriptPath = path.join(__dirname, '../utils/generate_password_from_excel.js');
    const command = `node "${scriptPath}" "${inputFilePath}"`;
    
    try {
      const { stdout, stderr } = await execAsync(command, { 
        timeout: 60000, // 1 minute timeout
        maxBuffer: 1024 * 1024 // 1MB buffer
      });
      
      console.log('✅ Password generation completed');
      if (stderr) console.log('⚠️ Warnings:', stderr);
      
      // Find the generated output file
      const outputFileName = inputFileName.replace('.xlsx', '_with_hashed_passwords.xlsx');
      const outputFilePath = path.join(dataDir, outputFileName);
      
      if (!fs.existsSync(outputFilePath)) {
        throw new Error('Password generation failed - output file not found');
      }

      // Read the generated file to get user data
      const workbook = XLSX.readFile(outputFilePath);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const userData = XLSX.utils.sheet_to_json(worksheet);

      console.log(`📊 Generated passwords for ${userData.length} users`);

      // Insert/Update users in database - FIXED for your schema
      let insertedCount = 0;
      let updatedCount = 0;
      const errors = [];
      
      for (const user of userData) {
        if (user.email && user.hashed_password && user.user_id) {
          try {
            console.log(`🔍 Processing user: ${user.user_id} - ${user.email}`);

            // Validate role
            const validRoles = ['admin', 'student', 'alumni'];
            if (!validRoles.includes(user.role)) {
              throw new Error(`Invalid role: ${user.role}`);
            }

            // Check if user already exists by user_id or email
            const existingUser = await pool.query(
              'SELECT user_id FROM users WHERE user_id = $1 OR email = $2',
              [user.user_id, user.email.toLowerCase()]
            );

            if (existingUser.rows.length === 0) {
              // Insert new user - FIXED to include user_id and all columns
              await pool.query(
                `INSERT INTO users (
                  user_id, email, password, role, name, phone, department, 
                  college_name, graduation_year, current_company, designation, bio
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
                [
                  user.user_id, // Use user_id from Excel
                  user.email.toLowerCase(),
                  user.hashed_password,
                  user.role,
                  user.name || user.email.split('@')[0],
                  user.phone || null,
                  user.department || null,
                  user.college_name || null,
                  user.graduation_year ? parseInt(user.graduation_year) : null,
                  user.current_company || null,
                  user.designation || null,
                  user.bio || null
                ]
              );
              insertedCount++;
              console.log(`✅ Inserted user: ${user.email} with ID: ${user.user_id}`);
            } else {
              // Update existing user
              await pool.query(
                `UPDATE users SET 
                  password = $2, role = $3, name = $4, phone = $5, department = $6,
                  college_name = $7, graduation_year = $8, current_company = $9, 
                  designation = $10, bio = $11
                 WHERE user_id = $1`,
                [
                  user.user_id,
                  user.hashed_password,
                  user.role,
                  user.name || user.email.split('@')[0],
                  user.phone || null,
                  user.department || null,
                  user.college_name || null,
                  user.graduation_year ? parseInt(user.graduation_year) : null,
                  user.current_company || null,
                  user.designation || null,
                  user.bio || null
                ]
              );
              updatedCount++;
              console.log(`🔄 Updated user: ${user.email}`);
            }
          } catch (dbError) {
            console.error(`❌ Database error for ${user.email}:`, dbError.message);
            errors.push({
              user_id: user.user_id,
              email: user.email,
              error: dbError.message
            });
          }
        } else {
          console.log(`⚠️ Skipping user - missing required data:`, {
            user_id: user.user_id,
            email: user.email,
            hasPassword: !!user.hashed_password
          });
        }
      }

      console.log(`📊 Database: Inserted: ${insertedCount}, Updated: ${updatedCount}, Errors: ${errors.length}`);

      // Send emails
      console.log(`📨 Starting to send emails...`);
      let emailsSent = 0;
      let emailsFailed = 0;
      const failedEmails = [];

      for (const user of userData) {
        try {
          if (!user.email || !user.plain_password) {
            emailsFailed++;
            continue;
          }

          const emailResult = await sendCredentialEmail(
            user.email, 
            user.plain_password, 
            user.role || 'student'
          );
          
          if (emailResult && emailResult.success) {
            emailsSent++;
            console.log(`✅ Email sent to: ${user.email}`);
          } else {
            emailsFailed++;
            failedEmails.push({ 
              email: user.email, 
              error: emailResult?.error || 'Unknown error' 
            });
            console.log(`❌ Email failed for: ${user.email}`);
          }

          // Small delay between emails
          await new Promise(resolve => setTimeout(resolve, 100));

        } catch (emailError) {
          console.error(`❌ Email error for ${user.email}:`, emailError);
          emailsFailed++;
          failedEmails.push({ email: user.email, error: emailError.message });
        }
      }

      console.log(`📧 Email results: Sent: ${emailsSent}, Failed: ${emailsFailed}`);

      // Create download URL
      const downloadUrl = `/api/admin/download-generated/${outputFileName}`;

      // Return results
      res.json({
        success: true,
        message: 'Process completed successfully',
        totalProcessed: userData.length,
        successCount: userData.filter(row => row.hashed_password).length,
        errorCount: userData.filter(row => !row.hashed_password).length,
        insertedInDB: insertedCount,
        updatedInDB: updatedCount,
        databaseErrors: errors.slice(0, 5),
        emailsSent,
        emailsFailed,
        failedEmails: failedEmails.slice(0, 5),
        outputFilePath: outputFilePath,
        downloadUrl: downloadUrl,
        fileName: outputFileName,
        emailResults: {
          emailsSent,
          emailsFailed,
          totalProcessed: emailsSent + emailsFailed
        }
      });

    } catch (execError) {
      console.error('❌ Password generation script error:', execError);
      throw new Error(`Password generation failed: ${execError.message}`);
    }

  } catch (error) {
    console.error('❌ Overall process error:', error);
    
    // Clean up temp file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to process Excel file',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// Download generated file
router.get('/download-generated/:filename', auth, adminAuth, (req, res) => {
  try {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '../data', filename);
    
    console.log('📥 Download request for:', filePath);
    
    if (!fs.existsSync(filePath)) {
      console.log('❌ File not found:', filePath);
      return res.status(404).json({ message: 'File not found' });
    }
    
    res.download(filePath, filename);
  } catch (error) {
    console.error('File download error:', error);
    res.status(500).json({ message: 'Failed to download file' });
  }
});

// Keep your existing reset-password and send-credentials routes as they are...
// [Rest of the routes remain the same as in your original file]

router.post('/send-credentials', auth, adminAuth, async (req, res) => {
  try {
    const { excelFilePath, userType = 'all' } = req.body;

    if (!excelFilePath || !fs.existsSync(excelFilePath)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Excel file not found' 
      });
    }

    const workbook = XLSX.readFile(excelFilePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const users = XLSX.utils.sheet_to_json(worksheet);

    let emailsSent = 0;
    let emailsFailed = 0;
    const failedEmails = [];

    for (const user of users) {
      try {
        if (!user.email || !user.plain_password) {
          emailsFailed++;
          continue;
        }

        if (userType !== 'all' && user.role !== userType) {
          continue;
        }

        const emailResult = await sendCredentialEmail(user.email, user.plain_password, user.role || 'student');
        
        if (emailResult && emailResult.success) {
          emailsSent++;
        } else {
          emailsFailed++;
          failedEmails.push({ email: user.email, error: emailResult?.error || 'Unknown error' });
        }

        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (emailError) {
        emailsFailed++;
        failedEmails.push({ email: user.email, error: emailError.message });
      }
    }

    res.json({
      success: true,
      message: 'Credential emails processed',
      emailsSent,
      emailsFailed,
      totalProcessed: emailsSent + emailsFailed,
      failedEmails: failedEmails.slice(0, 10)
    });

  } catch (error) {
    console.error('❌ Send credentials error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send credential emails',
      error: error.message
    });
  }
});

router.post('/reset-password', auth, adminAuth, async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ 
        success: false, 
        message: 'Email is required' 
      });
    }

    const user = await pool.query(
      'SELECT user_id, name, email, role FROM users WHERE email = $1',
      [email.toLowerCase()]
    );

    if (user.rows.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const userData = user.rows[0];
    const emailPrefix = email.split('@')[0];
    let tempPassword = '@';
    let firstLetterFound = false;
    
    for (let i = 0; i < emailPrefix.length; i++) {
      const char = emailPrefix[i];
      if (!firstLetterFound && /[a-zA-Z]/.test(char)) {
        tempPassword += char.toUpperCase();
        firstLetterFound = true;
      } else {
        tempPassword += char;
      }
    }
    
    tempPassword += Math.floor(Math.random() * 100);
    const hashedPassword = await bcrypt.hash(tempPassword, 12);

    await pool.query(
      'UPDATE users SET password = $1 WHERE email = $2',
      [hashedPassword, email.toLowerCase()]
    );

    try {
      const emailResult = await sendCredentialEmail(userData.email, tempPassword, userData.role);
      
      res.json({
        success: true,
        message: 'Password reset successfully',
        tempPassword: tempPassword,
        userEmail: userData.email,
        userName: userData.name,
        emailSent: emailResult?.success || false,
        emailError: emailResult?.success ? null : (emailResult?.error || 'Email sending failed')
      });
    } catch (emailError) {
      res.json({
        success: true,
        message: 'Password reset successfully, but email sending failed',
        tempPassword: tempPassword,
        userEmail: userData.email,
        userName: userData.name,
        emailSent: false,
        emailError: emailError.message
      });
    }

  } catch (error) {
    console.error('❌ Password reset error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reset password',
      error: error.message
    });
  }
});

// Add new route to check processing status
router.get('/check-status/:jobId', auth, adminAuth, async (req, res) => {
  const { jobId } = req.params;
  const statusFile = path.join(__dirname, '../data', `status_${jobId}.json`);
  
  if (fs.existsSync(statusFile)) {
    const status = JSON.parse(fs.readFileSync(statusFile, 'utf8'));
    res.json(status);
  } else {
    res.json({ status: 'processing' });
  }
});

async function processExcelFile(inputFilePath, timestamp) {
  try {
    // ... all your existing processing logic ...
    
    // Save status to file
    const statusFile = path.join(__dirname, '../data', `status_${timestamp}.json`);
    fs.writeFileSync(statusFile, JSON.stringify({
      status: 'completed',
      results: responseData
    }));
  } catch (error) {
    const statusFile = path.join(__dirname, '../data', `status_${timestamp}.json`);
    fs.writeFileSync(statusFile, JSON.stringify({
      status: 'error',
      error: error.message
    }));
  }
}

module.exports = router;