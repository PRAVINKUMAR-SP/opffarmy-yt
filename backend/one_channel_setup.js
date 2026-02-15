const mongoose = require('mongoose');
const Category = require('./models/Category');
const Channel = require('./models/Channel');
const Video = require('./models/Video');
const Post = require('./models/Post');
require('dotenv').config();

const setup = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // 1. Create Category
        let category = await Category.findOne({ name: 'General' });
        if (!category) {
            category = await Category.create({ name: 'General', icon: '🌐' });
            console.log('✅ Category created');
        }

        // 2. Create Channel
        let channel = await Channel.findOne({ handle: '@all_users' });
        if (!channel) {
            channel = await Channel.create({
                name: 'All Users Community',
                handle: '@all_users',
                description: 'The official channel for all community content!',
                avatarUrl: 'https://ui-avatars.com/api/?name=All+Users&background=008cff&color=fff&size=128&bold=true',
                bannerUrl: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=1200&h=300&fit=crop',
                subscribers: 0,
                isVerified: true
            });
            console.log('✅ Channel created');
        }

        // 3. Create Video
        await Video.create({
            title: 'Welcome to the Community!',
            description: 'This is our first community-driven video asset.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=640',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            channel: channel._id,
            category: category._id,
            duration: '0:33',
            views: 125,
            likes: 12
        });
        console.log('✅ Video created');

        // 4. Create Post
        await Post.create({
            content: 'Hello World! This is our first community post on the "All Users" channel.',
            imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800',
            channel: channel._id
        });
        console.log('✅ Post created');

        // 5. Create Live Stream
        await Video.create({
            title: 'LIVE: Community Town Hall',
            description: 'Join us live for the community discussion.',
            thumbnailUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=640',
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
            channel: channel._id,
            category: category._id,
            type: 'live',
            isLive: true,
            viewers: 42
        });
        console.log('✅ Live Stream created');

        console.log('\n🚀 One-Channel Setup Complete!');
        process.exit(0);
    } catch (err) {
        console.error('Setup Error:', err);
        process.exit(1);
    }
};

setup();
