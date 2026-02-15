const express = require('express');
const router = express.Router();
const Playlist = require('../models/Playlist');
const { auth } = require('../middleware/auth');

// GET /api/playlists/user/:userId — Get all playlists of a user
router.get('/user/:userId', async (req, res) => {
    try {
        const playlists = await Playlist.find({ owner: req.params.userId })
            .populate('videos', 'title thumbnailUrl duration views createdAt')
            .sort({ updatedAt: -1 });
        res.json(playlists);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// GET /api/playlists/:id — Get single playlist
router.get('/:id', async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id)
            .populate({
                path: 'videos',
                populate: {
                    path: 'channel',
                    select: 'name avatarUrl handle isVerified'
                }
            })
            .populate('owner', 'name avatar');

        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// POST /api/playlists — Create new playlist
router.post('/', auth, async (req, res) => {
    try {
        const { title, description, privacy, videoId } = req.body;
        const playlist = await Playlist.create({
            title,
            description,
            privacy,
            owner: req.user.id,
            videos: videoId ? [videoId] : []
        });
        res.status(201).json(playlist);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// PATCH /api/playlists/:id/add — Add video to playlist
router.patch('/:id/add', auth, async (req, res) => {
    try {
        const { videoId } = req.body;
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        if (playlist.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        if (!playlist.videos.includes(videoId)) {
            playlist.videos.push(videoId);
            await playlist.save();
        }

        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// PATCH /api/playlists/:id/remove — Remove video from playlist
router.patch('/:id/remove', auth, async (req, res) => {
    try {
        const { videoId } = req.body;
        const playlist = await Playlist.findById(req.params.id);

        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        if (playlist.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        playlist.videos = playlist.videos.filter(v => v.toString() !== videoId);
        await playlist.save();

        res.json(playlist);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// DELETE /api/playlists/:id — Delete playlist
router.delete('/:id', auth, async (req, res) => {
    try {
        const playlist = await Playlist.findById(req.params.id);
        if (!playlist) return res.status(404).json({ error: 'Playlist not found' });
        if (playlist.owner.toString() !== req.user.id) {
            return res.status(403).json({ error: 'Not authorized' });
        }

        await Playlist.findByIdAndDelete(req.params.id);
        res.json({ message: 'Playlist deleted' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
