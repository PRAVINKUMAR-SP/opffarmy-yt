const mongoose = require('mongoose');

const channelSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    handle: { type: String, required: true, unique: true, trim: true },
    description: { type: String, default: '' },
    avatarUrl: { type: String, default: '' },
    bannerUrl: { type: String, default: '' },
    subscribers: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Channel', channelSchema);
