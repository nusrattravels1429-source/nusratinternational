/**
 * Nusrat Travels - Node.js/Express Server
 */
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

// Define PORT explicitly for Vercel compatibility
const PORT = process.env.PORT || 3000;

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Set view engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// MongoDB Connection
let db = null;
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.error('❌ ERROR: MONGODB_URI environment variable is NOT set in Vercel.');
      return;
    }
    console.log('🔍 Attempting to connect to MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    db = client.db('nusrat_travels'); // Ensure this matches your DB name in Atlas
    app.locals.db = db;
    console.log('✅ MongoDB Connected successfully to DB: nusrat_travels');
    
    // Quick check for collections
    const collections = await db.listCollections().toArray();
    console.log('📦 Available collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
  }
};

// Connect to database
connectDB();

// Import routes safely
try {
  const routes = require('./routes/index');
  app.use('/', routes);
  console.log('✅ Routes loaded successfully');
} catch (error) {
  console.error('⚠️ Could not load routes (might be missing):', error.message);
  // Fallback route if routes file is missing
  app.get('/', (req, res) => {
    res.send('Server is running. Connect DB to see content.');
  });
}

// API Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    dbConnected: !!db,
    message: 'Nusrat Travels API is running',
    timestamp: new Date().toISOString()
  });
});

// Get all packages
app.get('/api/packages', async (req, res) => {
  try {
    const db = req.app.locals.db;
    if (!db) {
      console.warn('⚠️ API Request received but DB is not connected.');
      return res.status(503).json({ error: 'Database not connected', checkLogs: true });
    }

    const { category, featured } = req.query;
    const query = { isActive: true };
    if (featured === 'true') query.featured = true;

    let packages = [];
    const sort = { createdAt: -1 };

    if (category === 'travel') {
      packages = await db.collection('travel_packages').find(query).sort(sort).toArray();
    } else if (category === 'hajj') {
      packages = await db.collection('hajj_packages').find(query).sort(sort).toArray();
    } else if (category === 'work') {
      packages = await db.collection('work_packages').find(query).sort(sort).toArray();
    } else {
      const travel = await db.collection('travel_packages').find(query).sort(sort).toArray();
      const hajj = await db.collection('hajj_packages').find(query).sort(sort).toArray();
      const work = await db.collection('work_packages').find(query).sort(sort).toArray();
      packages = [...travel, ...hajj, ...work];
    }

    console.log(`📤 Returned ${packages.length} packages for category: ${category || 'all'}`);
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// Export for Vercel
module.exports = app;