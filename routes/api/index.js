const express = require('express');
const router = express.Router();

const contentController = require('../../src/controllers/contentController');
const cardController = require('../../src/controllers/cardController');
const galleryController = require('../../src/controllers/galleryController');
const certificationController = require('../../src/controllers/certificationController');
const teamController = require('../../src/controllers/teamController');
const navigationController = require('../../src/controllers/navigationController');
const footerController = require('../../src/controllers/footerController');

const { protectAdmin } = require('../../src/middleware/auth');

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

// Team
router.get('/team', teamController.apiGetTeam);

// Navigation
router.get('/navigation', navigationController.apiGetNavigation);

// Footer
router.get('/footer', footerController.apiGetFooter);

module.exports = router;
