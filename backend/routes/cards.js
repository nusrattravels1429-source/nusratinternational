const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

// GET /api/cards - Returns all cards
router.get('/', async (req, res) => {
  try {
    const cards = await Card.find().sort({ createdAt: -1 });
    res.json({ success: true, count: cards.length, data: cards });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

// GET /api/cards/:id - Returns a single card by MongoDB _id
router.get('/:id', async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    
    if (!card) {
      return res.status(404).json({ 
        success: false, 
        message: 'Card not found' 
      });
    }
    
    res.json({ success: true, data: card });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server Error', 
      error: error.message 
    });
  }
});

module.exports = router;
