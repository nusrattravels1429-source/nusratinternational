const express = require('express');
const router = express.Router();
const heroController = require('../../src/controllers/heroController');
const { protectAdmin } = require('../../src/middleware/auth');
const { upload } = require('../../src/middleware/upload');

// All routes are protected and prefixed with /api/admin/hero-slides defined in index.js
router.get('/', protectAdmin, heroController.getSlides);
router.post('/', protectAdmin, upload.single('heroImage'), heroController.createSlide);
router.put('/:id', protectAdmin, upload.single('heroImage'), heroController.updateSlide);
router.delete('/:id', protectAdmin, heroController.deleteSlide);
router.post('/reorder', protectAdmin, heroController.reorderSlides);

module.exports = router;
