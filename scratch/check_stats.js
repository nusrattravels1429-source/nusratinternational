const { MongoClient } = require('mongodb');
require('dotenv').config();

async function check() {
    const client = new MongoClient(process.env.MONGODB_URI);
    try {
        await client.connect();
        const db = client.db();
        const stats = await db.collection('sitecontents').findOne({ section: 'about', key: 'about-stats' });
        console.log('Stats in DB:', JSON.stringify(stats, null, 2));
    } finally {
        await client.close();
    }
}
check();
