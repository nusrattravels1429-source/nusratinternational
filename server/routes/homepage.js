const express = require('express');
const router = express.Router();

// Get homepage content
router.get('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    let content = await db.collection('homepage_content').findOne({});
    
    // If no content exists, create default empty structure
    if (!content) {
      const defaultContent = {
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
        newsAndUpdates: [],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      await db.collection('homepage_content').insertOne(defaultContent);
      content = defaultContent;
    }
    
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error loading homepage content:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Update homepage content (for admin panel)
router.put('/', async (req, res) => {
  try {
    const db = req.app.locals.db;
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    let content = await db.collection('homepage_content').findOne({});
    
    if (content) {
      const result = await db.collection('homepage_content').findOneAndUpdate(
        { _id: content._id },
        { $set: updateData },
        { returnDocument: 'after' }
      );
      content = result.value;
    } else {
      const result = await db.collection('homepage_content').insertOne({
        ...updateData,
        createdAt: new Date()
      });
      content = { _id: result.insertedId, ...updateData };
    }
    
    res.json({ success: true, data: content });
  } catch (error) {
    console.error('Error updating homepage content:', error);
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;
