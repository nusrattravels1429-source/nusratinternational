/**
 * Nusrat Travels - Node.js/Express Server
 * Updated for strict Vercel error handling
 */
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB Connection with Strict Error Handling
let db = null;
const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ FATAL: MONGODB_URI is missing in Environment Variables');
    // In Vercel, we don't crash the whole process immediately, but we flag it
    return; 
  }

  try {
    console.log('🔍 Attempting to connect to MongoDB...');
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    db = client.db('nusrat_travels'); // Ensure this matches your DB name
    app.locals.db = db;
    console.log('✅ MongoDB Connected successfully to DB: nusrat_travels');
    
    // Test connection
    const collections = await db.listCollections().toArray();
    console.log(`📦 Found collections: ${collections.map(c => c.name).join(', ')}`);
    
  } catch (error) {
    console.error('❌ FATAL MongoDB Connection Error:', error.message);
    console.error('Full Error:', error);
    // Re-throw to stop execution if critical
    throw error; 
  }
};

// Connect before setting up routes
connectDB().catch(err => {
  console.error('Server starting despite DB failure. Check logs above.');
});

// Import routes safely
try {
  const routes = require('./routes/index');
  app.use('/', routes);
  console.log('✅ Routes loaded successfully');
} catch (err) {
  console.error('❌ Failed to load routes:', err.message);
  // Create a fallback route if routes fail
  app.get('/', (req, res) => {
    res.send('Error loading application routes. Check deployment logs.');
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: db ? 'OK' : 'DB_DISCONNECTED',
    message: db ? 'Nusrat Travels API is running' : 'Database not connected',
    timestamp: new Date().toISOString()
  });
});

// API: Get Packages
app.get('/api/packages', async (req, res) => {
  if (!db) {
    console.warn('⚠️ Request received but DB is not connected');
    return res.status(503).json({ error: 'Database not connected', checkLogs: true });
  }
  try {
    const { category } = req.query;
    let packages = [];
    
    if (category === 'travel') {
      packages = await db.collection('travel_packages').find({ isActive: true }).toArray();
    } else if (category === 'hajj') {
      packages = await db.collection('hajj_packages').find({ isActive: true }).toArray();
    } else if (category === 'work') {
      packages = await db.collection('work_packages').find({ isActive: true }).toArray();
    } else {
      // Fetch all if no category
      const t = await db.collection('travel_packages').find({ isActive: true }).toArray();
      const h = await db.collection('hajj_packages').find({ isActive: true }).toArray();
      const w = await db.collection('work_packages').find({ isActive: true }).toArray();
      packages = [...t, ...h, ...w];
    }
    
    console.log(`📤 Returned ${packages.length} packages for category: ${category || 'all'}`);
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export for Vercel
module.exports = app;