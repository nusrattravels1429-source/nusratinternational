const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// --- CRITICAL DB CHECK ---
let db = null;

async function initDB() {
  const uri = process.env.MONGODB_URI;
  
  // 1. Force crash if variable is missing
  if (!uri) {
    console.error('💥 FATAL: MONGODB_URI environment variable is NOT SET in Vercel.');
    console.error('💥 Go to Vercel Dashboard > Settings > Environment Variables and add MONGODB_URI');
    throw new Error('MONGODB_URI_MISSING');
  }

  console.log('🔍 URI Found. Length:', uri.length);
  console.log('🔍 Attempting connection to MongoDB...');

  try {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await client.connect();
    
    // 2. Force crash if DB name is wrong
    const testDb = client.db('nusrat_travels'); 
    await testDb.command({ ping: 1 });
    
    db = testDb;
    app.locals.db = db;
    console.log('✅ SUCCESS: Connected to MongoDB "nusrat_travels"');
    
    // Verify collections exist
    const cols = await db.listCollections().toArray();
    console.log('📂 Collections found:', cols.map(c => c.name).join(', '));
    
    if (cols.length === 0) {
      console.warn('⚠️ WARNING: Database is empty! No collections found.');
    }
    
  } catch (err) {
    console.error('💥 FATAL CONNECTION ERROR:', err.message);
    console.error('💥 Full Detail:', err);
    throw err; // This stops the server so you see the error
  }
}

// Run initialization BEFORE starting server
initDB().then(() => {
  console.log('🚀 Server Ready');
}).catch((err) => {
  console.error('💥 SERVER CRASHED ON STARTUP:', err.message);
  process.exit(1); // Force Vercel to mark deployment as failed so you see logs
});

// Routes (Only load if we get this far)
try {
  const routes = require('./routes/index');
  app.use('/', routes);
} catch (e) {
  console.error('Route load error:', e.message);
  app.get('/', (req, res) => res.send('Route Error: ' + e.message));
}

// Fallback API
app.get('/api/health', (req, res) => {
  res.json({ status: db ? 'OK' : 'DB_DOWN', error: process.env.MONGODB_URI ? 'URI Exists' : 'URI Missing' });
});

module.exports = app;