const express = require('express');
const router = express.Router();

// --- Controllers ---
const authController = require('../../src/controllers/authController');
const contentController = require('../../src/controllers/contentController');
const cardController = require('../../src/controllers/cardController');
const galleryController = require('../../src/controllers/galleryController');
const teamController = require('../../src/controllers/teamController');
const certificationController = require('../../src/controllers/certificationController');
const navigationController = require('../../src/controllers/navigationController');
const footerController = require('../../src/controllers/footerController');

// --- Auth Middleware & Uploads ---
const { protectAdmin } = require('../../src/middleware/auth');
const { upload } = require('../../src/middleware/upload');

// =============================================================================
// AUTH ROUTES
// =============================================================================
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);
router.get('/dashboard', protectAdmin, authController.getDashboard);

// =============================================================================
// CONTENT MANAGEMENT (section-based, upsert)
// =============================================================================
router.get('/content/manage/:section', protectAdmin, contentController.manageContent);
router.post('/content/update', protectAdmin, upload.fields([
  { name: 'imageUrl', maxCount: 1 },
  { name: 'heroImage', maxCount: 1 },
  { name: 'bgImage', maxCount: 1 }
]), contentController.updateContent);
router.post('/content/update-slides', protectAdmin, upload.fields([
  { name: 'slideImage_0', maxCount: 1 },
  { name: 'slideImage_1', maxCount: 1 },
  { name: 'slideImage_2', maxCount: 1 },
  { name: 'slideImage_3', maxCount: 1 }
]), contentController.updateSlides);
router.post('/content/delete/:id', protectAdmin, contentController.deleteContent);

// =============================================================================
// CARDS MANAGEMENT (Travel / Hajj / Work)
// =============================================================================
router.get('/cards', protectAdmin, cardController.manageCards);
router.get('/cards/create', protectAdmin, cardController.getCreateCard);
router.post('/cards/create', protectAdmin, upload.array('images', 5), cardController.createCard);
router.get('/cards/edit/:id', protectAdmin, cardController.getEditCard);
router.post('/cards/update/:id', protectAdmin, upload.array('images', 5), cardController.updateCard);
router.post('/cards/delete/:id', protectAdmin, cardController.deleteCard);
router.post('/cards/toggle-status/:id', protectAdmin, cardController.toggleStatus);

// =============================================================================
// GALLERY MANAGEMENT
// =============================================================================
router.get('/gallery', protectAdmin, galleryController.manageGallery);
router.post('/gallery/create', protectAdmin, upload.single('image'), galleryController.createGalleryItem);
router.post('/gallery/update/:id', protectAdmin, upload.single('image'), galleryController.updateGalleryItem);
router.post('/gallery/delete/:id', protectAdmin, galleryController.deleteGalleryItem);

// =============================================================================
// TEAM MANAGEMENT
// =============================================================================
router.get('/team', protectAdmin, teamController.manageTeam);
router.post('/team/founder', protectAdmin, upload.single('image'), teamController.updateFounder);
router.post('/team/create', protectAdmin, upload.single('image'), teamController.createMember);
router.post('/team/update/:id', protectAdmin, upload.single('image'), teamController.updateMember);
router.post('/team/delete/:id', protectAdmin, teamController.deleteMember);

// =============================================================================
// CERTIFICATIONS MANAGEMENT
// =============================================================================
router.get('/certifications', protectAdmin, certificationController.manageCertifications);
router.post('/certifications/create', protectAdmin,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]),
  certificationController.createCertification
);
router.post('/certifications/update/:id', protectAdmin,
  upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]),
  certificationController.updateCertification
);
router.post('/certifications/delete/:id', protectAdmin, certificationController.deleteCertification);
router.post('/certifications/toggle-featured/:id', protectAdmin, certificationController.toggleFeatured);

// =============================================================================
// NAVIGATION MANAGEMENT
// =============================================================================
router.get('/navigation', protectAdmin, navigationController.manageNavigation);
router.post('/navigation/create', protectAdmin, navigationController.createLink);
router.post('/navigation/update/:id', protectAdmin, navigationController.updateLink);
router.post('/navigation/delete/:id', protectAdmin, navigationController.deleteLink);

// =============================================================================
// FOOTER MANAGEMENT
// =============================================================================
router.get('/footer', protectAdmin, footerController.manageFooter);
router.post('/footer/update', protectAdmin, upload.single('logo'), footerController.updateFooter);

module.exports = router;
