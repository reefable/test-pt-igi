const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
        return res.status(401).json({ error: 'Akses ditolak' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'rahasia_banget';
        const decoded = jwt.verify(token, secret);
        
        // Attach user info to request object
        req.user = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: 'Token error bos.' });
    }
};

module.exports = verifyToken;