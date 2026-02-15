/**
 * Migration Script: Upload local files to Cloudinary and update MongoDB URLs
 * 
 * Usage: 
 *   1. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET to .env
 *   2. Run: node migrate_to_cloudinary.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Models
const Video = require('./models/Video');
const Channel = require('./models/Channel');
const User = require('./models/User');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const UPLOADS_DIR = path.join(__dirname, 'uploads');

async function uploadToCloudinary(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const isVideo = ['.mp4', '.webm', '.mov', '.avi'].includes(ext);

    try {
        const result = await cloudinary.uploader.upload(filePath, {
            resource_type: isVideo ? 'video' : 'image',
            folder: 'opffarmy-yt',
        });
        return result.secure_url;
    } catch (err) {
        console.error(`  ❌ Failed to upload ${path.basename(filePath)}: ${err.message}`);
        return null;
    }
}

async function migrate() {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Get all files in uploads directory
    if (!fs.existsSync(UPLOADS_DIR)) {
        console.log('❌ No uploads directory found!');
        process.exit(1);
    }

    const files = fs.readdirSync(UPLOADS_DIR).filter(f => !f.startsWith('.'));
    console.log(`📁 Found ${files.length} files to upload\n`);

    // Build a map: old path -> new Cloudinary URL
    const urlMap = {};

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const filePath = path.join(UPLOADS_DIR, file);
        const oldUrl = `/uploads/${file}`;

        console.log(`📤 [${i + 1}/${files.length}] Uploading: ${file}...`);
        const newUrl = await uploadToCloudinary(filePath);

        if (newUrl) {
            urlMap[oldUrl] = newUrl;
            console.log(`  ✅ → ${newUrl}`);
        }
    }

    console.log(`\n🔄 Updating MongoDB documents...\n`);

    // Update Videos
    const videos = await Video.find({});
    let videoUpdates = 0;
    for (const video of videos) {
        let changed = false;
        if (urlMap[video.thumbnailUrl]) {
            video.thumbnailUrl = urlMap[video.thumbnailUrl];
            changed = true;
        }
        if (urlMap[video.videoUrl]) {
            video.videoUrl = urlMap[video.videoUrl];
            changed = true;
        }
        if (changed) {
            await video.save();
            videoUpdates++;
            console.log(`  📹 Updated video: ${video.title}`);
        }
    }

    // Update Channels
    const channels = await Channel.find({});
    let channelUpdates = 0;
    for (const channel of channels) {
        let changed = false;
        if (urlMap[channel.avatarUrl]) {
            channel.avatarUrl = urlMap[channel.avatarUrl];
            changed = true;
        }
        if (urlMap[channel.bannerUrl]) {
            channel.bannerUrl = urlMap[channel.bannerUrl];
            changed = true;
        }
        if (changed) {
            await channel.save();
            channelUpdates++;
            console.log(`  📺 Updated channel: ${channel.name}`);
        }
    }

    // Update Users
    const users = await User.find({});
    let userUpdates = 0;
    for (const user of users) {
        if (urlMap[user.avatar]) {
            user.avatar = urlMap[user.avatar];
            await user.save();
            userUpdates++;
            console.log(`  👤 Updated user: ${user.name}`);
        }
    }

    console.log(`\n✨ Migration Complete!`);
    console.log(`   Videos updated: ${videoUpdates}`);
    console.log(`   Channels updated: ${channelUpdates}`);
    console.log(`   Users updated: ${userUpdates}`);
    console.log(`   Files uploaded to Cloudinary: ${Object.keys(urlMap).length}`);

    await mongoose.disconnect();
    process.exit(0);
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
