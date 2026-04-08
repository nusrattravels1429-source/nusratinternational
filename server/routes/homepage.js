const express = require('express');
const router = express.Router();
const HomepageContent = require('../models/HomepageContent');

// Get homepage content
router.get('/', async (req, res) => {
  try {
    let content = await HomepageContent.findOne();
    
    // If no content exists, create default empty structure
    if (!content) {
      content = await HomepageContent.create({
        heroSlider: [],
        featuredPackages: {
          travel: [],
          hajj: [],
          work: []
        },
        certifications: [],
        ticketingCountries: [],
        aboutSection: {
          title: { en: '', bn: '' },
          description: { en: '', bn: '' },
          highlights: []
        },
        stats: [],
        testimonials: [],
        newsAndUpdates: []
      });
    }
    
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Update homepage content (for admin panel)
router.put('/', async (req, res) => {
  try {
    let content = await HomepageContent.findOne();
    
    if (content) {
      content = await HomepageContent.findByIdAndUpdate(
        content._id,
        req.body,
        { new: true, runValidators: true }
      );
    } else {
      content = await HomepageContent.create(req.body);
    }
    
    res.json({ success: true, data: content });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;
