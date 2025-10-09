const express = require("express");
const cors = require("cors");
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Serve generated files
app.use('/data', express.static(path.join(__dirname, 'data')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/companies', require('./routes/companies'));
app.use('/api/email', require('./routes/email'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/questions', require('./routes/questions'));
app.use('/api/profile', require('./routes/profile'));
app.use('/api/admin', require('./routes/admin')); // Add this line
app.use('/api/stats', require('./routes/stats'));

app.use((err, req, res, next) => {
    console.error(err); // This will print the error details
    res.status(500).json({ error: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



