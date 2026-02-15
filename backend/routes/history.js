const express = require('express');
const router = express.Router();
const User = require('../models/User');

// GET /api/history/:userId — Fetch watch history
router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId)
            .populate({
                path: 'watchHistory.video',
                populate: {
                    path: 'channel',
                    select: 'name handle avatarUrl isVerified'
                }
            });

        if (!user) return res.status(404).json({ error: 'User not found' });

        // Filter out any potential null videos (if a video was deleted)
        const history = user.watchHistory.filter(h => h.video);
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/history/:userId — Clear all watch history
router.delete('/:userId', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.params.userId,
            { $set: { watchHistory: [] } },
            { new: true }
        );
        res.json({ message: 'History cleared', history: [] });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/history/:userId/:videoId — Remove single entry
router.delete('/:userId/:videoId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ error: 'User not found' });

        user.watchHistory = user.watchHistory.filter(h => h.video && h.video.toString() !== req.params.videoId);
        await user.save();
        res.json({ message: 'Removed from history' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
