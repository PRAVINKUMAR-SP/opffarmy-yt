require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const multer = require('multer');
const path = require('path');

const User = require('./models/User');

// Connect to MongoDB and seed admin
connectDB().then(async () => {
    try {
        const ADMIN_EMAIL = 'pravin007ptk@gmail.com';
        const existing = await User.findOne({ email: ADMIN_EMAIL });
        if (!existing) {
            await User.create({
                name: 'Pravin',
                email: ADMIN_EMAIL,
                password: 'pravin007@',
                role: 'admin',
                avatar: `https://api.dicebear.com/7.x/initials/svg?seed=Pravin`
            });
            console.log('✅ Admin account seeded');
        } else {
            // Force update role and password to ensure credentials work
            existing.role = 'admin';
            existing.password = 'pravin007@';
            await existing.save();
            console.log('✅ Admin account updated (Role & Password synced)');
        }
    } catch (err) {
        console.error('Admin seed error:', err.message);
    }
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configure Multer for Memory Storage
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 } // 50MB for serverless limits
});

const { auth } = require('./middleware/auth');
const cloudinary = require('./config/cloudinary');

// Upload Route (Protected & Cloud-Integrated)
app.post('/api/upload', auth, upload.single('file'), async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        // Stream upload to Cloudinary
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto',
                folder: 'opffarmy-yt'
            },
            (error, result) => {
                if (error) return res.status(500).json({ error: 'Cloudinary upload failed' });
                res.json({ url: result.secure_url });
            }
        );

        uploadStream.end(req.file.buffer);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Root Redirect/Info
app.get('/', (req, res) => {
    res.send(`
        <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
            <h1>🚀 OPFFARMY API is Running</h1>
            <p>To view the main website, please visit:</p>
            <a href="http://localhost:3000" style="font-size: 24px; color: #ff0000; font-weight: bold; text-decoration: none;">http://localhost:3000</a>
        </div>
    `);
});

// Routes
app.use('/api/videos', require('./routes/videos'));
app.use('/api/channels', require('./routes/channels'));
app.use('/api/comments', require('./routes/comments'));
app.use('/api/categories', require('./routes/categories'));
app.use('/api/search', require('./routes/search'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subscriptions', require('./routes/subscriptions'));
app.use('/api/history', require('./routes/history'));
app.use('/api/playlists', require('./routes/playlists'));

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
});

// Start server (only in non-Vercel environment)
const PORT = process.env.PORT || 5000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
