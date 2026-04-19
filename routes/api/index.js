const express = require('express');
const router = express.Router();

const contentController = require('../../src/controllers/contentController');
const cardController = require('../../src/controllers/cardController');
const galleryController = require('../../src/controllers/galleryController');
const certificationController = require('../../src/controllers/certificationController');
const teamController = require('../../src/controllers/teamController');
const navigationController = require('../../src/controllers/navigationController');
const footerController = require('../../src/controllers/footerController');
const heroController = require('../../src/controllers/heroController');

const navFooterController = require('../../src/controllers/navFooterController');

const { protectAdmin } = require('../../src/middleware/auth');

// ==========================================
// PUBLIC NAVBAR & FOOTER
// ==========================================
// Returns sorted, active navbar items only
router.get('/public/navbar', async (req, res) => {
    try {
        const db = await req.app.locals.getDb();
        const items = await db.collection('navitems').find({ isActive: true }).sort({ order: 1 }).toArray();
        res.json({ success: true, data: items || [] });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch navbar', error: error.message });
    }
});

// Returns footer settings
router.get('/public/footer', async (req, res) => {
    try {
        const db = await req.app.locals.getDb();
        const footer = await db.collection('footersettings').findOne({});
        res.json({ success: true, data: footer || null });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch footer', error: error.message });
    }
});

// Content
router.get('/content/:section', contentController.apiGetContent);

// Cards
router.get('/cards', cardController.getCards);
router.patch('/cards/:id/status', protectAdmin, cardController.toggleStatus);

// Gallery
router.get('/gallery', galleryController.apiGetGallery);

// Certifications
router.get('/certifications', certificationController.apiGetCertifications);
router.patch('/certifications/:id/featured', protectAdmin, certificationController.toggleFeatured);

// Hero Slider - Public API
router.get('/hero-slider', heroController.getHeroSliderAPI);

// Team
router.get('/team', teamController.apiGetTeam);

// Navigation
router.get('/navigation', navigationController.apiGetNavigation);

// Footer
router.get('/footer', footerController.apiGetFooter);

module.exports = router;
