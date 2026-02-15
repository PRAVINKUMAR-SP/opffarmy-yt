const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }, // Plain text for now as per user request flow, normally hash this
    handle: { type: String, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    avatar: { type: String, default: '' },
    channelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel' },
    watchHistory: [{
        video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
        watchedAt: { type: Date, default: Date.now }
    }],
    watchLater: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }]
}, { timestamps: true });

// Auto-generate handle if not provided
userSchema.pre('save', function (next) {
    if (!this.handle) {
        this.handle = `@${this.name.toLowerCase().replace(/\s+/g, '_')}_${Math.floor(Math.random() * 1000)}`;
    }
    next();
});

module.exports = mongoose.model('User', userSchema);
