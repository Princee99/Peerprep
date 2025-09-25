const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.token);
    req.user = {
      userId: decoded.user_id,
      role: decoded.role
    };
    
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token has expired',
        error: 'TOKEN_EXPIRED',
        expiredAt: err.expiredAt
      });
    }
    
    if (err.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token format',
        error: 'INVALID_TOKEN'
      });
    }
    
    if (err.name === 'NotBeforeError') {
      return res.status(401).json({ 
        message: 'Token not yet valid',
        error: 'TOKEN_NOT_ACTIVE'
      });
    }
    
    // Generic fallback for other JWT errors
    res.status(401).json({ 
      message: 'Token is not valid',
      error: 'TOKEN_INVALID'
    });
  }
};
