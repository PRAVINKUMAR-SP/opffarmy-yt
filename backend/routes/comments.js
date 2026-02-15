const express = require('express');
const router = express.Router();
const Comment = require('../models/Comment');

// GET /api/comments/:videoId — Comments for a video
router.get('/:videoId', async (req, res) => {
    try {
        const comments = await Comment.find({ video: req.params.videoId })
            .populate('user', 'name avatar')
            .sort({ createdAt: -1 });
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/comments — Add comment
router.post('/', async (req, res) => {
    try {
        const comment = await Comment.create(req.body);
        res.status(201).json(comment);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// DELETE /api/comments/:id — Delete comment
router.delete('/:id', async (req, res) => {
    try {
        const comment = await Comment.findByIdAndDelete(req.params.id);
        if (!comment) return res.status(404).json({ error: 'Comment not found' });
        res.json({ message: 'Comment deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/comments — All comments (for admin)
router.get('/', async (req, res) => {
    try {
        const comments = await Comment.find()
            .populate('video', 'title')
            .sort({ createdAt: -1 })
            .limit(100);
        res.json(comments);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/comments/:id/like — Like/Unlike comment
router.post('/:id/like', async (req, res) => {
    try {
        const { userId } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const isLiked = comment.likedBy.includes(userId);

        if (isLiked) {
            comment.likedBy = comment.likedBy.filter(id => id.toString() !== userId);
            comment.likes = Math.max(0, comment.likes - 1);
        } else {
            comment.likedBy.push(userId);
            comment.likes += 1;
        }

        await comment.save();
        res.json({ likes: comment.likes, hasLiked: !isLiked });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/comments/:id/reply — Add reply
router.post('/:id/reply', async (req, res) => {
    try {
        const { text, userId } = req.body;
        const comment = await Comment.findById(req.params.id);

        if (!comment) return res.status(404).json({ error: 'Comment not found' });

        const reply = {
            user: userId,
            text,
            createdAt: new Date()
        };

        comment.replies.push(reply);
        await comment.save();

        // Return the full comment with populated user details for the new reply
        const updatedComment = await Comment.findById(req.params.id)
            .populate('user', 'name avatar')
            .populate('replies.user', 'name avatar');

        res.json(updatedComment);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
