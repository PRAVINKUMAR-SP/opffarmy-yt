const express = require('express');
const router = express.Router();
const Video = require('../models/Video');
const User = require('../models/User');
const Channel = require('../models/Channel');

// GET /api/videos — List videos with filters
router.get('/', async (req, res) => {
    try {
        const { category, sort, limit = 20, page = 1, search } = req.query;
        const query = { isPublished: true };

        if (category && category !== 'undefined') query.categories = { $in: [category] };

        let sortOption = { createdAt: -1 };
        if (sort === 'views') sortOption = { views: -1 };
        if (sort === 'likes') sortOption = { likes: -1 };
        if (sort === 'oldest') sortOption = { createdAt: 1 };

        if (search && search !== 'undefined') {
            const regex = new RegExp(search, 'i');
            const channels = await Channel.find({
                $or: [{ name: regex }, { handle: regex }]
            }).select('_id');
            const channelIds = channels.map(c => c._id);

            query.$or = [
                { title: regex },
                { description: regex },
                { tags: regex },
                { channel: { $in: channelIds } }
            ];
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const total = await Video.countDocuments(query);
        const videos = await Video.find(query)
            .populate('channel', 'name handle avatarUrl isVerified')
            .populate('categories', 'name')
            .sort(sortOption)
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            videos,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit)),
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/videos/trending — Trending videos
router.get('/trending', async (req, res) => {
    try {
        const videos = await Video.find({ isPublished: true })
            .populate('channel', 'name handle avatarUrl isVerified')
            .populate('categories', 'name')
            .sort({ views: -1 })
            .limit(20);
        res.json({ videos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/videos/:id — Single video
router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id)
            .populate('channel', 'name handle avatarUrl isVerified subscribers description bannerUrl')
            .populate('categories', 'name');

        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json(video);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Helper to convert duration string (M:SS) to seconds
const durationToSeconds = (duration) => {
    if (!duration) return 0;
    const parts = duration.split(':').map(Number);
    if (parts.length === 1) return parts[0];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    return 0;
};

const { auth, admin } = require('../middleware/auth');

// POST /api/videos — Create video (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const videoData = { ...req.body, creator: req.user.id };

        // Auto-categorize as shorts if duration < 1 minute
        if (videoData.duration && videoData.type !== 'live') {
            const seconds = durationToSeconds(videoData.duration);
            if (seconds > 0 && seconds < 60) {
                videoData.type = 'short';
            }
        }

        if (videoData.type === 'live') {
            videoData.isLive = true;
        }

        // Ensure channel belongs to user (optional extra check, but good for security)
        // const channel = await Channel.findById(videoData.channel);
        // if (channel.owner.toString() !== req.user.id) return res.status(403).json({ error: 'Not authorized for this channel' });

        const video = await Video.create(videoData);
        const populated = await Video.findById(video._id)
            .populate('channel', 'name handle avatarUrl isVerified')
            .populate('categories', 'name')
            .populate('creator', 'name email');
        res.status(201).json(populated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/videos/:id — Update video (Protected: Owner/Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });

        // Check ownership or admin
        if (video.creator.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this video' });
        }

        const updatedVideo = await Video.findByIdAndUpdate(req.params.id, req.body, { new: true })
            .populate('channel', 'name handle avatarUrl isVerified')
            .populate('categories', 'name');

        res.json(updatedVideo);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/videos/:id — Delete video (Protected: Owner/Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });

        // Check ownership or admin
        if (video.creator.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this video' });
        }

        await Video.findByIdAndDelete(req.params.id);
        res.json({ message: 'Video deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/videos/:id/like — Like a video
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'User ID required' });

        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });

        const hasLiked = video.likedBy.includes(userId);

        if (hasLiked) {
            // Unlike
            video.likedBy = video.likedBy.filter(id => id.toString() !== userId);
            video.likes = Math.max(0, video.likes - 1);
        } else {
            // Like
            video.likedBy.push(userId);
            video.likes += 1;
        }

        await video.save();
        res.json({ likes: video.likes, hasLiked: !hasLiked });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/videos/:id/dislike — Dislike a video
router.post('/:id/dislike', async (req, res) => {
    try {
        const video = await Video.findByIdAndUpdate(
            req.params.id,
            { $inc: { dislikes: 1 } },
            { new: true }
        );
        if (!video) return res.status(404).json({ error: 'Video not found' });
        res.json({ dislikes: video.dislikes });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/videos/:id/view — Record a unique view
router.post('/:id/view', async (req, res) => {
    try {
        const { userId } = req.body;
        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });

        if (userId) {
            // 1. Record unique view on video
            const hasViewed = video.viewedBy.some(id => id.toString() === userId.toString());
            if (!hasViewed) {
                video.viewedBy.push(userId);
                video.views += 1;
                await video.save();
            }

            // 2. Add to User's Watch History
            const user = await User.findById(userId);
            if (user) {
                // Remove existing entry for this video if any
                user.watchHistory = user.watchHistory.filter(h => h.video && h.video.toString() !== req.params.id);
                // Prepend new entry
                user.watchHistory.unshift({ video: req.params.id, watchedAt: new Date() });
                // Limit size to 50
                if (user.watchHistory.length > 50) {
                    user.watchHistory = user.watchHistory.slice(0, 50);
                }
                await user.save();
            }
        } else {
            // Anonymous view increment
            video.views += 1;
            await video.save();
        }

        res.json({ views: video.views });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/videos/:id/save — Toggle video in Watch Later
router.post('/:id/save', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'User ID is required' });

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        if (!user.watchLater) user.watchLater = [];
        const videoIndex = user.watchLater.findIndex(vId => vId.toString() === req.params.id);
        let saved = false;

        if (videoIndex === -1) {
            user.watchLater.push(req.params.id);
            saved = true;
        } else {
            user.watchLater.splice(videoIndex, 1);
            saved = false;
        }

        await user.save();
        res.json({ saved, count: user.watchLater.length });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/videos/saved/:userId — Fetch Watch Later videos
router.get('/saved/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId).populate({
            path: 'watchLater',
            populate: {
                path: 'channel',
                select: 'name handle avatarUrl isVerified'
            }
        });
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user.watchLater || []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/videos/:id/report — Report a video
router.post('/:id/report', async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) return res.status(400).json({ error: 'User ID is required' });

        const video = await Video.findById(req.params.id);
        if (!video) return res.status(404).json({ error: 'Video not found' });

        if (!video.reportedBy) video.reportedBy = [];
        // Check if user already reported
        const alreadyReported = video.reportedBy.some(id => id.toString() === userId.toString());
        if (!alreadyReported) {
            video.reportedBy.push(userId);
            await video.save();
        }

        res.json({ message: 'Video reported successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
