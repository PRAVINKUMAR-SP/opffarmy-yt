/**
 * Media Cleanup Script V2: Stronger regex and logging
 */

require('dotenv').config();
const mongoose = require('mongoose');

// Models
const Video = require('./models/Video');
const Channel = require('./models/Channel');
const User = require('./models/User');

function fixUrl(url) {
    if (!url || !url.includes('cloudinary.com')) return url;

    let original = url;

    // Fix missing slash after version: /v12345678opffarmy-yt/ -> /v12345678/opffarmy-yt/
    // This specifically looks for the folder name starting with 'o' or other letters after digits
    let fixed = url.replace(/\/v(\d+)([a-zA-Z])/, '/v$1/$2');

    if (fixed !== original) {
        console.log(`    MATCH: ${original} -> ${fixed}`);
    }

    return fixed;
}

async function cleanup() {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Fix Videos
    const videos = await Video.find({});
    console.log(`🔍 Scanning ${videos.length} videos...`);
    let videoUpdates = 0;
    for (const video of videos) {
        let changed = false;

        const fixedThumbnail = fixUrl(video.thumbnailUrl);
        if (fixedThumbnail !== video.thumbnailUrl) {
            video.thumbnailUrl = fixedThumbnail;
            changed = true;
        }

        const fixedVideo = fixUrl(video.videoUrl);
        if (fixedVideo !== video.videoUrl) {
            video.videoUrl = fixedVideo;
            changed = true;
        }

        // Fix thumbnails that are accidentally .mp4
        if (video.thumbnailUrl && video.thumbnailUrl.toLowerCase().endsWith('.mp4')) {
            // Replace .mp4 with .jpg (Cloudinary allows this if it's actually an image)
            // Or many Cloudinary URLs for videos end in .jpg for thumbnails
            video.thumbnailUrl = video.thumbnailUrl.replace(/\.mp4$/i, '.jpg');
            changed = true;
        }

        if (changed) {
            await video.save();
            videoUpdates++;
            console.log(`  📹 Fixed video: ${video.title}`);
        }
    }

    // Fix Channels
    const channels = await Channel.find({});
    console.log(`🔍 Scanning ${channels.length} channels...`);
    let channelUpdates = 0;
    for (const channel of channels) {
        let changed = false;

        const fixedAvatar = fixUrl(channel.avatarUrl);
        if (fixedAvatar !== channel.avatarUrl) {
            channel.avatarUrl = fixedAvatar;
            changed = true;
        }

        const fixedBanner = fixUrl(channel.bannerUrl);
        if (fixedBanner !== channel.bannerUrl) {
            channel.bannerUrl = fixedBanner;
            changed = true;
        }

        if (changed) {
            await channel.save();
            channelUpdates++;
            console.log(`  📺 Fixed channel: ${channel.name}`);
        }
    }

    // Fix Users
    const users = await User.find({});
    console.log(`🔍 Scanning ${users.length} users...`);
    let userUpdates = 0;
    for (const user of users) {
        const fixedAvatar = fixUrl(user.avatar);
        if (fixedAvatar !== user.avatar) {
            user.avatar = fixedAvatar;
            await user.save();
            userUpdates++;
            console.log(`  👤 Fixed user: ${user.name}`);
        }
    }

    console.log(`\n✨ Media Cleanup Complete!`);
    console.log(`   Videos fixed: ${videoUpdates}`);
    console.log(`   Channels fixed: ${channelUpdates}`);
    console.log(`   Users fixed: ${userUpdates}`);

    await mongoose.disconnect();
    process.exit(0);
}

cleanup().catch(err => {
    console.error('Cleanup failed:', err);
    process.exit(1);
});
