/**
 * Nusrat Travels - Node.js/Express Server
 * Updated for strict Vercel error handling
 */
const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

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
let dbReady = false;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;
  
  console.log('🔍 Checking MONGODB_URI...');
  console.log('URI Exists:', !!uri);
  console.log('URI Length:', uri ? uri.length : 0);
  
  if (uri) {
    const masked = uri.replace(/\/\/([^:]+):([^@]+)@/, '//$1:***@');
    console.log('URI Structure:', masked);
  } else {
    console.error('❌ FATAL: MONGODB_URI is missing or empty!');
    return;
  }

  try {
    console.log('🔄 Attempting MongoDB connection...');
    const client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    await client.connect();
    db = client.db('nusrat_travels'); 
    app.locals.db = db;
    dbReady = true;
    
    const collections = await db.listCollections().toArray();
    console.log('✅ MongoDB Connected successfully!');
    console.log('📂 Found collections:', collections.map(c => c.name).join(', '));
    
  } catch (error) {
    console.error('❌ FATAL CONNECTION ERROR:', error.message);
    console.error('Full Error:', error);
    // Do NOT throw or exit in Vercel, just log and let routes handle it
  }
};

// Connect immediately (only once)
connectDB();

// Import routes safely
try {
  const routes = require('./routes/index');
  app.use('/', routes);
  console.log('✅ Routes loaded successfully');
} catch (err) {
  console.error('❌ Failed to load routes:', err.message);
  app.get('/', (req, res) => {
    res.send('Error loading application routes. Check deployment logs.');
  });
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: dbReady ? 'OK' : 'DB_DISCONNECTED',
    message: dbReady ? 'Nusrat Travels API is running' : 'Database not connected',
    timestamp: new Date().toISOString()
  });
});

// API: Get Packages
app.get('/api/packages', async (req, res) => {
  if (!dbReady) {
    console.warn('⚠️ Request received but DB is not connected');
    return res.status(503).json({ 
      error: 'Database not connected', 
      hint: 'Check Vercel logs for "FATAL CONNECTION ERROR"' 
    });
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
      const t = await db.collection('travel_packages').find({ isActive: true }).toArray();
      const h = await db.collection('hajj_packages').find({ isActive: true }).toArray();
      const w = await db.collection('work_packages').find({ isActive: true }).toArray();
      packages = [...t, ...h, ...w];
    }
    
    console.log(`📤 Returned ${packages.length} packages`);
    res.json(packages);
  } catch (error) {
    console.error('Error fetching packages:', error);
    res.status(500).json({ error: error.message });
  }
});

// Export for Vercel
module.exports = app;