const { MongoClient } = require('mongodb');
require('dotenv').config();

async function checkInbox() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI not found');
    return;
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('nusrat_travels');
    const messages = await db.collection('inbox').find().toArray();
    console.log('Total messages:', messages.length);
    console.log('Last message:', messages[messages.length - 1]);
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

checkInbox();
