require('dotenv').config();
const mongoose = require('mongoose');

const deepClear = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const User = require('./models/User');
        const Channel = require('./models/Channel');
        const Video = require('./models/Video');
        const Post = require('./models/Post');
        const Subscription = require('./models/Subscription');
        const Category = require('./models/Category');
        const Comment = require('./models/Comment');

        console.log('🧹 Clearing interaction data...');
        await Video.deleteMany({});
        await Post.deleteMany({});
        await Subscription.deleteMany({});
        await Comment.deleteMany({});

        console.log('🧹 Clearing core metadata...');
        await Channel.deleteMany({});
        // We might want to keep categories, but let's clear them for a true fresh start if needed.
        // await Category.deleteMany({}); 

        console.log('👤 Resetting all user channel links...');
        await User.updateMany({}, { $unset: { channelId: "" } });

        console.log('✨ DEEP CLEANUP SUCCESSFUL.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Deep Cleanup Failed:', err);
        process.exit(1);
    }
};

deepClear();
