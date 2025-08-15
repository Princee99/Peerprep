// middleware/isAdmin.js
module.exports = function (req, res, next) {
    try {
        // Assuming `auth` middleware has already attached `req.user`
        if (!req.user || req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }
        next();
    } catch (err) {
        console.error('Admin check error:', err.message);
        res.status(500).json({ message: 'Server Error' });
    }
};
