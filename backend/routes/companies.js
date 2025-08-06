const router = require('express').Router();
const pool = require('../config/db');
const auth = require('../middleware/auth');

// Get a single company by ID (this must come BEFORE the general GET route)
router.get('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        // console.log('Fetching company with ID:', id);
        
        const company = await pool.query(
            "SELECT * FROM companies WHERE id = $1",
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
router.post('/', auth, async (req, res) => {
    try {
        const { name, website, location, description } = req.body;
        const user_id = req.user.user_id; // From auth middleware

        const newCompany = await pool.query(
            "INSERT INTO companies (name, website, location, description, created_by) VALUES ($1, $2, $3, $4, $5) RETURNING *",
            [name, website, location, description, user_id]
        );

        res.json(newCompany.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: "Server Error" });
    }
});

// Update a company
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, website, location, description } = req.body;

        const updateCompany = await pool.query(
            "UPDATE companies SET name = $1, website = $2, location = $3, description = $4 WHERE id = $5 RETURNING *",
            [name, website, location, description, id]
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
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const deleteCompany = await pool.query(
            "DELETE FROM companies WHERE id = $1 RETURNING *",
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
