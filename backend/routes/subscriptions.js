const express = require('express');
const router = express.Router();
const Subscription = require('../models/Subscription');
const Channel = require('../models/Channel');

// POST /api/subscriptions/subscribe — Subscribe to a channel
router.post('/subscribe', async (req, res) => {
    try {
        const { userId, channelId } = req.body;
        if (!userId || !channelId) return res.status(400).json({ error: 'User and Channel ID required' });

        // Check if already subscribed
        const existing = await Subscription.findOne({ subscriber: userId, channel: channelId });
        if (existing) {
            // Unsubscribe
            await Subscription.findByIdAndDelete(existing._id);
            await Channel.findByIdAndUpdate(channelId, { $inc: { subscribers: -1 } });
            return res.json({ subscribed: false });
        }

        // Subscribe
        await Subscription.create({ subscriber: userId, channel: channelId });
        await Channel.findByIdAndUpdate(channelId, { $inc: { subscribers: 1 } });
        res.status(201).json({ subscribed: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/subscriptions/check/:userId/:channelId — Check subscription status
router.get('/check/:userId/:channelId', async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            subscriber: req.params.userId,
            channel: req.params.channelId
        });
        res.json({ subscribed: !!subscription });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/subscriptions/:userId — Get user's subscriptions
router.get('/:userId', async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ subscriber: req.params.userId })
            .populate('channel', 'name handle avatarUrl isVerified');
        res.json(subscriptions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
