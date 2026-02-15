const express = require('express');
const router = express.Router();
const Post = require('../models/Post');

// Get all posts (optionally filter by channel)
router.get('/', async (req, res) => {
    try {
        const filter = {};
        if (req.query.channel) {
            filter.channel = req.query.channel;
        }
        const posts = await Post.find(filter)
            .populate('channel', 'name handle avatarUrl')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

const { auth } = require('../middleware/auth');

// Create a post
router.post('/', auth, async (req, res) => {
    const post = new Post({
        content: req.body.content,
        imageUrl: req.body.imageUrl,
        channel: req.body.channel,
        creator: req.user.id // Use ID from token
    });

    try {
        const newPost = await post.save();
        const populatedPost = await Post.findById(newPost._id)
            .populate('channel', 'name handle avatarUrl')
            .populate('creator', 'name email');
        res.status(201).json(populatedPost);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a post
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Check ownership or admin
        if (post.creator.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Post.findByIdAndDelete(req.params.id);
        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Like a post
router.post('/:id/like', auth, async (req, res) => {
    try {
        const userId = req.user.id; // Use ID from token

        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ error: 'Post not found' });

        const hasLiked = post.likedBy.includes(userId);

        if (hasLiked) {
            // Unlike
            post.likedBy = post.likedBy.filter(id => id.toString() !== userId);
            post.likes = Math.max(0, post.likes - 1);
        } else {
            // Like
            post.likedBy.push(userId);
            post.likes += 1;
        }

        await post.save();
        res.json({ likes: post.likes, hasLiked: !hasLiked });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
