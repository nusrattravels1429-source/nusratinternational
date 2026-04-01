const express = require('express');
const router = express.Router();
const TravelPackage = require('../models/TravelPackage');
const HajjPackage = require('../models/HajjPackage');
const WorkPackage = require('../models/WorkPackage');

// Get all travel packages
router.get('/travel', async (req, res) => {
  try {
    const { featured, limit } = req.query;
    let query = { isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    let packagesQuery = TravelPackage.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      packagesQuery = packagesQuery.limit(parseInt(limit));
    }
    
    const packages = await packagesQuery.exec();
    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get single travel package by slug
router.get('/travel/:slug', async (req, res) => {
  try {
    const pkg = await TravelPackage.findOne({ slug: req.params.slug, isActive: true });
    
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get all hajj packages
router.get('/hajj', async (req, res) => {
  try {
    const { featured, type, subType, limit } = req.query;
    let query = { isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (type) {
      query.packageType = type;
    }
    
    if (subType) {
      query.subType = subType;
    }
    
    let packagesQuery = HajjPackage.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      packagesQuery = packagesQuery.limit(parseInt(limit));
    }
    
    const packages = await packagesQuery.exec();
    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get single hajj package by slug
router.get('/hajj/:slug', async (req, res) => {
  try {
    const pkg = await HajjPackage.findOne({ slug: req.params.slug, isActive: true });
    
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get all work packages
router.get('/work', async (req, res) => {
  try {
    const { featured, sector, limit } = req.query;
    let query = { isActive: true };
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    if (sector) {
      query.sectors = { $in: [sector] };
    }
    
    let packagesQuery = WorkPackage.find(query).sort({ createdAt: -1 });
    
    if (limit) {
      packagesQuery = packagesQuery.limit(parseInt(limit));
    }
    
    const packages = await packagesQuery.exec();
    res.json({ success: true, count: packages.length, data: packages });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

// Get single work package by slug
router.get('/work/:slug', async (req, res) => {
  try {
    const pkg = await WorkPackage.findOne({ slug: req.params.slug, isActive: true });
    
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    
    res.json({ success: true, data: pkg });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error: error.message });
  }
});

module.exports = router;
