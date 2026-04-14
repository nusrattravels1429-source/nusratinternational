const mongoose = require('mongoose');

// Connect to MongoDB
let cachedDb = null;

async function connectDB() {
  if (cachedDb) {
    return cachedDb;
  }

  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    throw new Error('MONGODB_URI environment variable is not set');
  }

  const mongoose = require('mongoose');
  
  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });

  cachedDb = mongoose.connection;
  console.log('✅ Mongoose connected to MongoDB');
  
  return cachedDb;
}

module.exports = connectDB;
