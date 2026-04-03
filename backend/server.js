require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Import routes
const cardsRoutes = require('./routes/cards');

// Initialize Express app
const app = express();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB Connected'))
  .catch(err => console.error('❌ MongoDB Connection Error:', err.message));

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - serve public folder
app.use(express.static(path.join(__dirname, '../public')));

// API Routes
app.use('/api/cards', cardsRoutes);

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
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at: http://localhost:${PORT}/api`);
  console.log(`📋 Cards endpoint: http://localhost:${PORT}/api/cards`);
});

module.exports = app;
