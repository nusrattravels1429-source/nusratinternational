const express = require('express');
const router = express.Router();
const heroController = require('../../src/controllers/heroController');
const { protectAdmin } = require('../../src/middleware/auth');
const { upload } = require('../../src/middleware/upload');

// Admin API routes - All routes are protected
router.get('/', protectAdmin, heroController.getSlides);
router.put('/:id', protectAdmin, upload.single('heroImage'), heroController.updateSlide);

module.exports = router;
