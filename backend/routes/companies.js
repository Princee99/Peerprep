// const express = require("express");
// const app = express();
// app.use('/uploads', express.static('uploads'));

const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');
const isAdmin = require('../middleware/isAdmin');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
     cb(null, file.originalname);
    }
});

const upload = multer({ storage });

// Get a single company by ID (this must come BEFORE the general GET route)
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        // console.log('Fetching company with ID:', id);
        
        const company = await pool.query(
            "SELECT * FROM companies WHERE company_id = $1",
            [id]
        );

        // console.log('Company query result:', company.rows);

        if (company.rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.json(company.rows[0]);
    } catch (err) {
        console.error('Error fetching company:', err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Get all companies
router.get('/', auth, async (req, res) => {
    try {
        const companies = await pool.query(
            "SELECT * FROM companies ORDER BY created_at DESC"
        );
        res.json(companies.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Add a new company
router.post('/', auth, isAdmin,upload.single('logo'),async (req, res) => {
    try {
        const { name, website, location } = req.body;
        const user_id = req.user.user_id; // From auth middleware
        const logo_url = req.file ? `/uploads/${req.file.filename}` : null; // Get the logo URL from the uploaded file

        const newCompany = await pool.query(
            "INSERT INTO companies (name, website, location, logo_url, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, website, location, logo_url, user_id]
        );

        res.json(newCompany.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Update a company
router.put('/:id', auth,isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, website, location, logo_url } = req.body;

        const updateCompany = await pool.query(
            "UPDATE companies SET name = $1, website = $2, location = $3, logo_url = $4 WHERE company_id = $5 RETURNING *",
            [name, website, location, logo_url, id]
        );

        if (updateCompany.rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.json(updateCompany.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Delete a company
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteCompany = await pool.query(
            "DELETE FROM companies WHERE company_id = $1 RETURNING *",
            [id]
        );

        if (deleteCompany.rows.length === 0) {
            return res.status(404).json({ message: "Company not found" });
        }

        res.json({ message: "Company deleted successfully" });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

module.exports = router;
