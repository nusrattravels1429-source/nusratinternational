const express = require('express');
const router = express.Router();

// Import controllers for API routes
const contentController = require('../../src/controllers/contentController');
const cardController = require('../../src/controllers/cardController');
const galleryController = require('../../src/controllers/galleryController');
const certificationController = require('../../src/controllers/certificationController');
const teamController = require('../../src/controllers/teamController');
const navigationController = require('../../src/controllers/navigationController');
const footerController = require('../../src/controllers/footerController');

// Import auth middleware
const { protectAdmin } = require('../../src/middleware/auth');

// ============ CONTENT API ============
router.get('/content/:section', contentController.apiGetContent);
router.put('/content/:section', protectAdmin, contentController.apiUpdateContent);

// ============ CARDS API ============
router.get('/cards', cardController.getCards); // Can be public for frontend use
// Note: POST/PUT/DELETE operations should go through admin routes with file upload
router.patch('/cards/:id/status', protectAdmin, cardController.toggleStatus);

// ============ GALLERY API ============
router.get('/gallery', galleryController.apiGetGallery);
router.post('/gallery', protectAdmin, galleryController.apiCreateGallery);
router.put('/gallery/:id', protectAdmin, galleryController.apiUpdateGallery);
router.delete('/gallery/:id', protectAdmin, galleryController.apiDeleteGallery);

// ============ CERTIFICATIONS API ============
router.get('/certifications', certificationController.apiGetCertifications);
router.post('/certifications', protectAdmin, certificationController.apiCreateCertification);
router.put('/certifications/:id', protectAdmin, certificationController.apiUpdateCertification);
router.delete('/certifications/:id', protectAdmin, certificationController.apiDeleteCertification);

// ============ TEAM API ============
router.get('/team', teamController.apiGetTeam);
router.post('/team', protectAdmin, teamController.apiCreateTeam);
router.put('/team/:id', protectAdmin, teamController.apiUpdateTeam);
router.delete('/team/:id', protectAdmin, teamController.apiDeleteTeam);

// ============ NAVIGATION API ============
router.get('/navigation', navigationController.apiGetNavigation);
router.post('/navigation', protectAdmin, navigationController.apiCreateNavigation);
router.put('/navigation/:id', protectAdmin, navigationController.apiUpdateNavigation);
router.delete('/navigation/:id', protectAdmin, navigationController.apiDeleteNavigation);

// ============ FOOTER API ============
router.get('/footer', footerController.apiGetFooter);
router.put('/footer', protectAdmin, footerController.apiUpdateFooter);

module.exports = router;
