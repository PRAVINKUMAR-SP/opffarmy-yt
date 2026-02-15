require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Video = require('./models/Video');
const Channel = require('./models/Channel');
const Comment = require('./models/Comment');
const Category = require('./models/Category');

const seedData = async () => {
    await connectDB();

    // Clear existing data
    await Promise.all([
        Video.deleteMany({}),
        Channel.deleteMany({}),
        Comment.deleteMany({}),
        Category.deleteMany({}),
    ]);

    console.log('🗑️  Cleared existing data');

    // Create Categories
    const categories = await Category.insertMany([
        { name: 'All', icon: '🏠' },
        { name: 'Music', icon: '🎵' },
        { name: 'Gaming', icon: '🎮' },
        { name: 'Education', icon: '📚' },
        { name: 'Entertainment', icon: '🎬' },
        { name: 'Sports', icon: '⚽' },
        { name: 'Technology', icon: '💻' },
        { name: 'News', icon: '📰' },
        { name: 'Comedy', icon: '😂' },
        { name: 'Science', icon: '🔬' },
        { name: 'Travel', icon: '✈️' },
        { name: 'Food', icon: '🍔' },
    ]);
    console.log('✅ Categories created');

    // Create Channels
    const channels = await Channel.insertMany([
        {
            name: 'TechVision',
            handle: '@techvision',
            description: 'Latest tech reviews, tutorials, and gadget unboxings. Your one-stop channel for everything technology!',
            avatarUrl: 'https://ui-avatars.com/api/?name=Tech+Vision&background=FF0000&color=fff&size=128&bold=true',
            bannerUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&h=300&fit=crop',
            subscribers: 1250000,
            isVerified: true,
        },
        {
            name: 'GamersHub',
            handle: '@gamershub',
            description: 'Epic gaming content, walkthroughs, and live streams. Join the gaming community!',
            avatarUrl: 'https://ui-avatars.com/api/?name=Gamers+Hub&background=7C3AED&color=fff&size=128&bold=true',
            bannerUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200&h=300&fit=crop',
            subscribers: 890000,
            isVerified: true,
        },
        {
            name: 'MusicVibes',
            handle: '@musicvibes',
            description: 'Music videos, live performances, and artist interviews from around the world.',
            avatarUrl: 'https://ui-avatars.com/api/?name=Music+Vibes&background=EC4899&color=fff&size=128&bold=true',
            bannerUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=1200&h=300&fit=crop',
            subscribers: 2100000,
            isVerified: true,
        },
        {
            name: 'LearnWithMe',
            handle: '@learnwithme',
            description: 'Educational content that makes learning fun and accessible for everyone.',
            avatarUrl: 'https://ui-avatars.com/api/?name=Learn+With+Me&background=10B981&color=fff&size=128&bold=true',
            bannerUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&h=300&fit=crop',
            subscribers: 560000,
            isVerified: false,
        },
        {
            name: 'FoodieWorld',
            handle: '@foodieworld',
            description: 'Delicious recipes, food reviews, and cooking tutorials from master chefs.',
            avatarUrl: 'https://ui-avatars.com/api/?name=Foodie+World&background=F59E0B&color=fff&size=128&bold=true',
            bannerUrl: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&h=300&fit=crop',
            subscribers: 430000,
            isVerified: false,
        },
        {
            name: 'SportsCentral',
            handle: '@sportscentral',
            description: 'Highlights, analysis, and breaking sports news from all major leagues.',
            avatarUrl: 'https://ui-avatars.com/api/?name=Sports+Central&background=3B82F6&color=fff&size=128&bold=true',
            bannerUrl: 'https://images.unsplash.com/photo-1461896836934-bd45ba734da7?w=1200&h=300&fit=crop',
            subscribers: 780000,
            isVerified: true,
        },
    ]);
    console.log('✅ Channels created');

    // Sample video thumbnails from Unsplash
    const thumbnails = [
        'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1461896836934-bd45ba734da7?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1535016120720-40c646be5580?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1504639725590-34d0984388bd?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1484417894907-623942c8ee29?w=640&h=360&fit=crop',
        'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=640&h=360&fit=crop',
    ];

    // Free sample video URL (Big Buck Bunny)
    const sampleVideoUrl = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
    const sampleVideoUrl2 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4';
    const sampleVideoUrl3 = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

    const videoUrls = [sampleVideoUrl, sampleVideoUrl2, sampleVideoUrl3];

    // Create Videos
    const videoData = [
        { title: 'Building a Full Stack App in 2024 - Complete Guide', description: 'Learn how to build a modern full-stack application using React, Node.js, and MongoDB. This comprehensive tutorial covers everything from setup to deployment.', channel: channels[0]._id, category: categories[6]._id, tags: ['react', 'nodejs', 'fullstack', 'tutorial'], duration: '45:22', views: 125000, likes: 8900 },
        { title: 'Top 10 VS Code Extensions Every Developer Needs', description: 'Boost your productivity with these must-have Visual Studio Code extensions that will transform your coding workflow.', channel: channels[0]._id, category: categories[6]._id, tags: ['vscode', 'developer', 'productivity', 'extensions'], duration: '12:45', views: 89000, likes: 6200 },
        { title: 'iPhone 16 Pro Max - The Ultimate Review', description: 'Is the iPhone 16 Pro Max worth the upgrade? We dive deep into every feature, camera test, and performance benchmark.', channel: channels[0]._id, category: categories[6]._id, tags: ['iphone', 'apple', 'review', 'smartphone'], duration: '28:15', views: 340000, likes: 24000 },
        { title: 'Epic Gaming Moments - Best of 2024 Compilation', description: 'The most incredible, funny, and jaw-dropping gaming moments from 2024. Get ready to be amazed!', channel: channels[1]._id, category: categories[2]._id, tags: ['gaming', 'compilation', 'funny', 'epic'], duration: '18:33', views: 560000, likes: 42000 },
        { title: 'GTA 6 - Everything We Know So Far', description: 'Complete breakdown of all GTA 6 leaks, trailers, and confirmed features. Release date, gameplay, map size, and more!', channel: channels[1]._id, category: categories[2]._id, tags: ['gta6', 'rockstar', 'gaming', 'trailer'], duration: '22:10', views: 2100000, likes: 156000 },
        { title: 'Minecraft Survival Guide - Day 1 to End Game', description: 'The ultimate Minecraft survival guide taking you from your first night to defeating the Ender Dragon.', channel: channels[1]._id, category: categories[2]._id, tags: ['minecraft', 'survival', 'guide', 'tutorial'], duration: '55:00', views: 430000, likes: 31000 },
        { title: 'Chill Lo-Fi Beats to Study & Relax To', description: 'Relaxing lo-fi hip hop beats perfect for studying, working, or just chilling. 3 hours of uninterrupted music.', channel: channels[2]._id, category: categories[1]._id, tags: ['lofi', 'study', 'relax', 'music'], duration: '3:02:15', views: 8900000, likes: 520000 },
        { title: 'Top 50 Songs of 2024 - Music Mashup', description: 'The biggest hits of 2024 mixed into one epic mashup. Featuring the most popular artists and viral songs.', channel: channels[2]._id, category: categories[1]._id, tags: ['music', 'mashup', '2024', 'hits'], duration: '15:44', views: 1200000, likes: 89000 },
        { title: 'Live Concert - Acoustic Sessions', description: 'Beautiful acoustic performances recorded live in our studio. Featuring indie artists from around the world.', channel: channels[2]._id, category: categories[1]._id, tags: ['acoustic', 'live', 'concert', 'indie'], duration: '42:30', views: 320000, likes: 28000 },
        { title: 'Python for Beginners - Full Course 2024', description: 'Learn Python programming from scratch. This free course covers variables, loops, functions, OOP, and real projects.', channel: channels[3]._id, category: categories[3]._id, tags: ['python', 'programming', 'beginner', 'tutorial'], duration: '4:12:00', views: 670000, likes: 48000 },
        { title: 'How the Universe Works - Mind Blowing Facts', description: 'Explore the most fascinating mysteries of our universe, from black holes to the multiverse theory.', channel: channels[3]._id, category: categories[9]._id, tags: ['universe', 'science', 'space', 'facts'], duration: '35:20', views: 890000, likes: 67000 },
        { title: 'World History in 30 Minutes', description: 'A fast-paced journey through the major events that shaped our world, from ancient civilizations to modern times.', channel: channels[3]._id, category: categories[3]._id, tags: ['history', 'education', 'world', 'documentary'], duration: '31:15', views: 450000, likes: 34000 },
        { title: 'Gordon Ramsay\'s Perfect Steak Guide', description: 'Master the art of cooking the perfect steak with tips and techniques from world-renowned chef Gordon Ramsay.', channel: channels[4]._id, category: categories[11]._id, tags: ['cooking', 'steak', 'recipe', 'gordonramsay'], duration: '14:22', views: 2300000, likes: 180000 },
        { title: '24 Hours Eating Street Food in Tokyo', description: 'Join us on an incredible street food adventure through Tokyo, Japan. From sushi to ramen to hidden gems!', channel: channels[4]._id, category: categories[11]._id, tags: ['food', 'tokyo', 'streetfood', 'japan'], duration: '25:40', views: 1800000, likes: 140000 },
        { title: '10 Easy Recipes for College Students', description: 'Delicious, budget-friendly recipes that anyone can make with minimal ingredients and cooking skills.', channel: channels[4]._id, category: categories[11]._id, tags: ['recipes', 'easy', 'college', 'budget'], duration: '20:15', views: 560000, likes: 42000 },
        { title: 'Champions League Final Highlights 2024', description: 'All the goals, saves, and dramatic moments from the UEFA Champions League Final 2024.', channel: channels[5]._id, category: categories[5]._id, tags: ['football', 'champions league', 'highlights', 'uefa'], duration: '16:30', views: 4500000, likes: 320000 },
        { title: 'NBA Top 10 Plays of the Week', description: 'The most incredible dunks, assists, and game-winning shots from this week in the NBA.', channel: channels[5]._id, category: categories[5]._id, tags: ['nba', 'basketball', 'top10', 'highlights'], duration: '8:45', views: 1100000, likes: 85000 },
        { title: 'How to Train Like a Professional Athlete', description: 'Inside look at the training routines, diets, and mindset of professional athletes across different sports.', channel: channels[5]._id, category: categories[5]._id, tags: ['fitness', 'training', 'athlete', 'workout'], duration: '38:20', views: 780000, likes: 56000 },
        { title: 'AI Revolution - How It Will Change Everything', description: 'Deep dive into artificial intelligence and how it is transforming every industry from healthcare to entertainment.', channel: channels[0]._id, category: categories[6]._id, tags: ['ai', 'technology', 'future', 'machinelearning'], duration: '42:10', views: 920000, likes: 71000 },
        { title: 'Comedy Special - Stand Up Night Live', description: 'Hilarious stand-up comedy performances that will have you laughing non-stop. Featuring top comedians.', channel: channels[1]._id, category: categories[8]._id, tags: ['comedy', 'standup', 'funny', 'live'], duration: '58:00', views: 1500000, likes: 120000 },
        { title: 'Travel Vlog: 7 Days in Bali', description: 'Experience the magic of Bali through stunning cinematography. Temples, beaches, rice terraces, and more!', channel: channels[4]._id, category: categories[10]._id, tags: ['travel', 'bali', 'vlog', 'indonesia'], duration: '32:15', views: 890000, likes: 65000 },
        { title: 'Breaking News: Major Tech Announcement', description: 'Live coverage and analysis of the biggest tech announcement of the year. Everything you need to know.', channel: channels[0]._id, category: categories[7]._id, tags: ['news', 'tech', 'breaking', 'announcement'], duration: '15:30', views: 670000, likes: 45000 },
        { title: 'CSS Animation Masterclass - Build Stunning UIs', description: 'Learn advanced CSS animations and transitions to create beautiful, interactive user interfaces.', channel: channels[3]._id, category: categories[6]._id, tags: ['css', 'animation', 'webdesign', 'frontend'], duration: '48:20', views: 340000, likes: 26000 },
        { title: 'The Science of Happiness - What Research Says', description: 'Explore the psychology and neuroscience behind happiness. Evidence-based strategies to live a happier life.', channel: channels[3]._id, category: categories[9]._id, tags: ['psychology', 'happiness', 'science', 'research'], duration: '27:45', views: 450000, likes: 38000 },
    ];

    const videos = await Video.insertMany(
        videoData.map((v, i) => ({
            ...v,
            thumbnailUrl: thumbnails[i % thumbnails.length],
            videoUrl: videoUrls[i % videoUrls.length],
        }))
    );
    console.log(`✅ ${videos.length} Videos created`);

    // Create Comments
    const commentUsernames = ['Alex_Dev', 'Sarah_Gamer', 'MikeReviews', 'JaneDoe', 'CoolCoder99', 'TechNerd', 'MusicLover', 'FoodieKing'];
    const commentTexts = [
        'This is absolutely amazing content! Keep it up! 🔥',
        'I learned so much from this video, thank you!',
        'This is exactly what I was looking for, subscribed!',
        'Great quality as always, love this channel!',
        'Can you make a follow-up video on this topic?',
        'Wow, this blew my mind! Sharing with all my friends.',
        'Perfect explanation, even a beginner can understand this.',
        'I\'ve been waiting for this video! So good!',
        'The production quality is insane 🎬',
        'This deserves way more views!',
        'Finally someone explains this properly!',
        'Watching this for the 3rd time, still amazing.',
    ];

    const commentData = [];
    for (const video of videos) {
        const numComments = Math.floor(Math.random() * 5) + 2;
        for (let i = 0; i < numComments; i++) {
            commentData.push({
                text: commentTexts[Math.floor(Math.random() * commentTexts.length)],
                video: video._id,
                username: commentUsernames[Math.floor(Math.random() * commentUsernames.length)],
                avatarUrl: `https://ui-avatars.com/api/?name=${commentUsernames[Math.floor(Math.random() * commentUsernames.length)]}&background=random&color=fff&size=64`,
                likes: Math.floor(Math.random() * 200),
            });
        }
    }
    await Comment.insertMany(commentData);
    console.log(`✅ ${commentData.length} Comments created`);

    console.log('\n🎉 Seed complete!');
    process.exit(0);
};

seedData().catch((err) => {
    console.error('❌ Seed failed:', err);
    process.exit(1);
});
