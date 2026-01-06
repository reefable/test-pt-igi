const db = require('../config/db');
const jwt = require('jsonwebtoken');
const { loginSchema } = require('../utils/validation');

exports.login = async (req, res) => {
    // 1. Validate Input
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { username, password } = req.body;

    try {
        // 2. Find User
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        if (users.length === 0) {
            return res.status(401).json({ error: 'Username atau Password salah!' });
        }

        const user = users[0];

        // 3. Periksa Password 
        // NOTE: In production, use bcrypt.compare(password, user.password)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Username atau Password salah!' });
        }

        // 4. Buat Token
        const secret = process.env.JWT_SECRET || 'rahasia_banget';
        const token = jwt.sign({ id: user.id, username: user.username }, secret, { expiresIn: '2h' });

        res.json({ 
            message: 'Login successful', 
            token,
            user: { id: user.id, username: user.username }
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    }
};