const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    content: { type: String, required: true },
    imageUrl: { type: String, default: '' },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    stats: {
        comments: { type: Number, default: 0 }
    }
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
