const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// GET /api/search?q=keyword
router.get('/', async (req, res) => {
    try {
        const { q, limit = 20 } = req.query;
        if (!q) return res.json({ videos: [] });

        // Try text search first, fall back to regex
        let videos;
        try {
            videos = await Video.find({
                $text: { $search: q },
                isPublished: true,
            })
                .populate('channel', 'name handle avatarUrl isVerified')
                .populate('categories', 'name')
                .sort({ score: { $meta: 'textScore' } })
                .limit(parseInt(limit));
        } catch {
            // Fallback to regex search
            const regex = new RegExp(q, 'i');
            videos = await Video.find({
                $or: [{ title: regex }, { description: regex }, { tags: regex }],
                isPublished: true,
            })
                .populate('channel', 'name handle avatarUrl isVerified')
                .populate('categories', 'name')
                .sort({ views: -1 })
                .limit(parseInt(limit));
        }

        res.json({ videos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/search/suggestions?q=keyword
router.get('/suggestions', async (req, res) => {
    try {
        const { q, limit = 10 } = req.query;
        if (!q) return res.json({ suggestions: [] });

        const regex = new RegExp(q, 'i');
        const videos = await Video.find({
            title: regex,
            isPublished: true
        })
            .select('title')
            .limit(parseInt(limit));

        const suggestions = [...new Set(videos.map(v => v.title))];
        res.json({ suggestions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
