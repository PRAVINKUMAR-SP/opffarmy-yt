const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const auth = (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key_123');
        req.user = decoded; // { id, role }
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};

// Middleware to verify Admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ error: 'Admin access denied' });
    }
};

module.exports = { auth, admin };
