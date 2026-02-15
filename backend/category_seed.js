require('dotenv').config();
const mongoose = require('mongoose');
const Category = require('./models/Category');

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        const categories = [
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
            { name: 'Food', icon: '🍔' }
        ];

        console.log('🧹 Clearing existing categories...');
        await Category.deleteMany({});

        console.log('🌱 Seeding new categories...');
        await Category.insertMany(categories);

        console.log('✅ Categories seeded successfully.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Seeding failed:', err);
        process.exit(1);
    }
};

seedCategories();
