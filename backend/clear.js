require('dotenv').config();
const mongoose = require('mongoose');

const clearData = async () => {
    try {
        console.log('⏳ Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected.');

        const collections = ['videos', 'channels', 'comments', 'categories', 'posts', 'subscriptions'];

        for (const col of collections) {
            console.log(`🧹 Clearing collection: ${col}...`);
            await mongoose.connection.collection(col).deleteMany({});
        }

        console.log('👤 Resetting user channel links...');
        await mongoose.connection.collection('users').updateMany({}, { $unset: { channelId: "" } });

        console.log('✨ Success: Database is now empty.');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during cleanup:', err);
        process.exit(1);
    }
};

clearData();
