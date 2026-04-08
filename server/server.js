require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { MongoClient } = require('mongodb');

// Initialize Express app
const app = express();

// MongoDB connection
let db;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nusrat_travels';

async function connectDB() {
  try {
    const client = new MongoClient(MONGO_URI);
    await client.connect();
    db = client.db('nusrat_travels');
    app.locals.db = db;
    console.log('✅ Connected to MongoDB:', db.databaseName);
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
  }
}

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set EJS as view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../views'));

// Static files - serve public folder and uploads
app.use(express.static(path.join(__dirname, '../public')));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/', require('./routes/index'));
app.use('/api/packages', require('./routes/packages'));
app.use('/api/homepage', require('./routes/homepage'));
app.use('/api/upload', require('./routes/upload'));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'API is running',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    success: false, 
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`🏠 Website: http://localhost:${PORT}`);
});

module.exports = app;
