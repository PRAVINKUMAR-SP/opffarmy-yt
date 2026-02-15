const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const Channel = require('../models/Channel');
const Comment = require('../models/Comment');
const Category = require('../models/Category');
const Post = require('../models/Post');
const User = require('../models/User');

const { auth, admin } = require('../middleware/auth');

// Protect all admin routes
router.use(auth, admin);

// GET /api/admin/stats — Dashboard stats
router.get('/stats', async (req, res) => {
    try {
        const [totalVideos, totalChannels, totalComments, totalCategories, totalPosts, totalUsers] = await Promise.all([
            Video.countDocuments(),
            Channel.countDocuments(),
            Comment.countDocuments(),
            Category.countDocuments(),
            Post.countDocuments(),
            User.countDocuments(),
        ]);

        const totalViews = await Video.aggregate([
            { $group: { _id: null, total: { $sum: '$views' } } },
        ]);

        const totalLikes = await Video.aggregate([
            { $group: { _id: null, total: { $sum: '$likes' } } },
        ]);

        const recentVideos = await Video.find()
            .populate('channel', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentComments = await Comment.find()
            .populate('video', 'title')
            .sort({ createdAt: -1 })
            .limit(5);

        const recentPosts = await Post.find()
            .populate('channel', 'name')
            .sort({ createdAt: -1 })
            .limit(5);

        const topChannels = await Channel.find()
            .sort({ subscribers: -1 })
            .limit(5);

        res.json({
            stats: {
                totalVideos,
                totalChannels,
                totalComments,
                totalCategories,
                totalPosts,
                totalUsers,
                totalViews: totalViews[0]?.total || 0,
                totalLikes: totalLikes[0]?.total || 0,
            },
            recentVideos,
            recentComments,
            recentPosts,
            topChannels,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/videos — All videos for admin
router.get('/videos', async (req, res) => {
    try {
        const videos = await Video.find()
            .populate('channel', 'name handle')
            .populate('categories', 'name')
            .sort({ createdAt: -1 });
        res.json(videos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/channels — All channels for admin
router.get('/channels', async (req, res) => {
    try {
        const channels = await Channel.find().sort({ createdAt: -1 });
        res.json(channels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/admin/users — All users for admin
router.get('/users', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
