const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true },
    description: { type: String, default: '' },
    thumbnailUrl: { type: String, required: true },
    videoUrl: { type: String, required: true },
    duration: { type: String, default: '0:00' },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: true },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    tags: [{ type: String }],
    isPublished: { type: Boolean, default: true },
    type: { type: String, enum: ['video', 'live', 'short'], default: 'video' },
    isLive: { type: Boolean, default: false },
    viewedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    shares: { type: Number, default: 0 },
    reportedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

videoSchema.index({ title: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Video', videoSchema);
