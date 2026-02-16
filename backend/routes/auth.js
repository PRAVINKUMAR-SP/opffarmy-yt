const express = require('express');
const router = express.Router();
const User = require('../models/User');

const jwt = require('jsonwebtoken');

// Generate JWT Token
const generateToken = (user) => {
    return jwt.sign(
        { id: user._id, role: user.role },
        process.env.JWT_SECRET || 'secret_key_123',
        { expiresIn: '7d' }
    );
};

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user exists
        const existing = await User.findOne({ email });
        if (existing) return res.status(400).json({ message: 'User already exists' });

        const ADMIN_EMAIL = 'pravin007ptk@gmail.com';
        const user = await User.create({
            name,
            email,
            password, // Plain text for simulation, normally bcrypt.hash
            role: email.toLowerCase() === ADMIN_EMAIL ? 'admin' : 'user',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`
        });

        const token = generateToken(user);
        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json({ ...userResponse, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email, password });

        if (!user) return res.status(401).json({ message: 'Invalid email or password' });

        const token = generateToken(user);
        const userResponse = user.toObject();
        delete userResponse.password;

        res.json({ ...userResponse, token });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
