const express = require('express');
const router = express.Router();
const Channel = require('../models/Channel');
const Video = require('../models/Video');

const User = require('../models/User');
const { auth } = require('../middleware/auth');

// GET /api/channels — List all channels
router.get('/', async (req, res) => {
    try {
        const channels = await Channel.find().sort({ subscribers: -1 });
        res.json(channels);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/channels/:id — Channel details + videos
router.get('/:id', async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if (!channel) return res.status(404).json({ error: 'Channel not found' });

        const videos = await Video.find({ channel: req.params.id, isPublished: true })
            .populate('categories', 'name')
            .sort({ createdAt: -1 });

        res.json({ channel, videos });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/channels — Create channel (Protected)
router.post('/', auth, async (req, res) => {
    try {
        const owner = req.user.id;
        const channelData = req.body;

        // 1. Check if owner already has a valid channel
        const existingUser = await User.findById(owner);
        if (existingUser && existingUser.channelId) {
            const actualChannel = await Channel.findById(existingUser.channelId);
            if (actualChannel) {
                return res.status(400).json({ error: 'User already has a channel' });
            }
        }

        // 2. Create the channel
        // Default avatar to user's avatar if not provided
        if (!channelData.avatarUrl && existingUser.avatar) {
            channelData.avatarUrl = existingUser.avatar;
        }

        const channel = await Channel.create({ ...channelData, owner });

        // 3. Link user to channel
        if (existingUser) {
            existingUser.channelId = channel._id;
            await existingUser.save();
        }

        res.status(201).json(channel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PUT /api/channels/:id — Update channel (Protected: Owner/Admin)
router.put('/:id', auth, async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if (!channel) return res.status(404).json({ error: 'Channel not found' });

        // Check ownership or admin
        if (channel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to update this channel' });
        }

        const updatedChannel = await Channel.findByIdAndUpdate(req.params.id, req.body, { new: true });

        // SYNC: If avatarUrl changed, update User avatar too
        if (req.body.avatarUrl) {
            await User.findByIdAndUpdate(channel.owner, { avatar: req.body.avatarUrl });
        }

        res.json(updatedChannel);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/channels/:id — Delete channel (Protected: Owner/Admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const channel = await Channel.findById(req.params.id);
        if (!channel) return res.status(404).json({ error: 'Channel not found' });

        // Check ownership or admin
        if (channel.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Not authorized to delete this channel' });
        }

        await Channel.findByIdAndDelete(req.params.id);
        // Also delete all channel's videos
        await Video.deleteMany({ channel: req.params.id });

        // Unlink from User
        await User.findByIdAndUpdate(channel.owner, { $unset: { channelId: 1 } });

        res.json({ message: 'Channel and its videos deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
