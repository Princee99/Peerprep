const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Get all questions with answers count
router.get('/', auth, async (req, res) => {
  try {
    const userRole = req.user.role;
    
    let query;
    if (userRole === 'admin') {
      // Admin can see user emails
      query = `
        SELECT q.*, u.email as student_email,
               COUNT(a.answer_id) as answer_count
        FROM questions q
        LEFT JOIN users u ON q.student_id = u.user_id
        LEFT JOIN answers a ON q.question_id = a.question_id
        GROUP BY q.question_id, u.email
        ORDER BY q.created_at DESC
      `;
    } else {
      // Students and alumni cannot see user emails
      query = `
        SELECT q.question_id, q.content, q.created_at, q.updated_at, q.company_id,
               COUNT(a.answer_id) as answer_count
        FROM questions q
        LEFT JOIN answers a ON q.question_id = a.question_id
        GROUP BY q.question_id, q.content, q.created_at, q.updated_at, q.company_id
        ORDER BY q.created_at DESC
      `;
    }
    
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single question with answers
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const userRole = req.user.role;
    
    let questionQuery, answersQuery;
    
    if (userRole === 'admin') {
      // Admin can see user emails
      questionQuery = `
        SELECT q.*, u.email as student_email
        FROM questions q
        LEFT JOIN users u ON q.student_id = u.user_id
        WHERE q.question_id = $1
      `;
      answersQuery = `
        SELECT a.*, u.email as alumni_email
        FROM answers a
        LEFT JOIN users u ON a.alumni_id = u.user_id
        WHERE a.question_id = $1
        ORDER BY a.created_at ASC
      `;
    } else {
      // Students and alumni cannot see user emails
      questionQuery = `
        SELECT q.question_id, q.content, q.created_at, q.updated_at, q.company_id
        FROM questions q
        WHERE q.question_id = $1
      `;
      answersQuery = `
        SELECT a.answer_id, a.content, a.created_at, a.updated_at
        FROM answers a
        WHERE a.question_id = $1
        ORDER BY a.created_at ASC
      `;
    }
    
    const questionResult = await pool.query(questionQuery, [id]);
    
    if (questionResult.rows.length === 0) {
      return res.status(404).json({ message: 'Question not found' });
    }
    
    const answersResult = await pool.query(answersQuery, [id]);
    
    res.json({
      question: questionResult.rows[0],
      answers: answersResult.rows
    });
  } catch (error) {
    console.error('Error fetching question details:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new question (students only) - FIXED
router.post('/', auth, async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    
    if (userRole !== 'student') {
      return res.status(403).json({ message: 'Only students can ask questions' });
    }
    
    const result = await pool.query(
      'INSERT INTO questions (content, student_id) VALUES ($1, $2) RETURNING *',
      [content, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add answer to question (alumni only)
router.post('/:id/answers', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    
    if (userRole !== 'alumni') {
      return res.status(403).json({ message: 'Only alumni can answer questions' });
    }
    
    const result = await pool.query(
      'INSERT INTO answers (question_id, content, alumni_id) VALUES ($1, $2, $3) RETURNING *',
      [id, content, userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding answer:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get questions for a specific company
router.get('/company/:companyId', auth, async (req, res) => {
  try {
    const { companyId } = req.params;
    const userRole = req.user.role;
    
    let query;
    if (userRole === 'admin') {
      // Admin can see user emails
      query = `
        SELECT q.*, u.email as student_email,
               COUNT(a.answer_id) as answer_count
        FROM questions q
        LEFT JOIN users u ON q.student_id = u.user_id
        LEFT JOIN answers a ON q.question_id = a.question_id
        WHERE q.company_id = $1
        GROUP BY q.question_id, u.email
        ORDER BY q.created_at DESC
      `;
    } else {
      // Students and alumni cannot see user emails
      query = `
        SELECT q.question_id, q.content, q.created_at, q.updated_at,
               COUNT(a.answer_id) as answer_count
        FROM questions q
        LEFT JOIN answers a ON q.question_id = a.question_id
        WHERE q.company_id = $1
        GROUP BY q.question_id, q.content, q.created_at, q.updated_at
        ORDER BY q.created_at DESC
      `;
    }
    
    const result = await pool.query(query, [companyId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching company questions:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new question for a specific company (students only)
router.post('/company/:companyId', auth, async (req, res) => {
  try {
    const { companyId } = req.params;
    const { content } = req.body;
    const userId = req.user.user_id;
    const userRole = req.user.role;
    
    if (userRole !== 'student') {
      return res.status(403).json({ message: 'Only students can ask questions' });
    }
    
    const result = await pool.query(
      'INSERT INTO questions (content, student_id, company_id) VALUES ($1, $2, $3) RETURNING *',
      [content, userId, companyId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating company question:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;