const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, default: '' },
    privacy: {
        type: String,
        enum: ['public', 'private', 'unlisted'],
        default: 'public'
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Video'
    }],
    thumbnailUrl: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', playlistSchema);
