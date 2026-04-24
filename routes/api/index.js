const express = require('express');
const router = express.Router();

const contentController = require('../../src/controllers/contentController');
const cardController = require('../../src/controllers/cardController');
const galleryController = require('../../src/controllers/galleryController');
const certificationController = require('../../src/controllers/certificationController');
const teamController = require('../../src/controllers/teamController');
const heroController = require('../../src/controllers/heroController');
const headerFooterController = require('../../src/controllers/headerFooterController');
const inboxController = require('../../src/controllers/inboxController');

const { protectAdmin } = require('../../src/middleware/auth');
const { upload } = require('../../src/middleware/upload');

// ==========================================
// PUBLIC APIs (No auth required)
// ==========================================
router.get('/public/navbar', headerFooterController.getPublicNavbar);
router.get('/public/footer', headerFooterController.getPublicFooter);
router.get('/public/gallery', galleryController.getPublicGallery);
router.get('/public/certifications', certificationController.getPublicCertifications);
router.post('/public/messages', inboxController.submitMessage);

// ==========================================
// HEADER/NAVBAR ADMIN APIs (Protected)
// ==========================================
router.get('/admin/header/nav', protectAdmin, headerFooterController.getNavItems);
router.post('/admin/header/nav', protectAdmin, headerFooterController.createNavItem);
router.put('/admin/header/nav/:id', protectAdmin, headerFooterController.updateNavItem);
router.delete('/admin/header/nav/:id', protectAdmin, headerFooterController.deleteNavItem);
router.post('/admin/header/nav/reorder', protectAdmin, headerFooterController.reorderNavItems);
router.post('/admin/header/logo', protectAdmin, upload.single('headerLogo'), headerFooterController.updateHeaderLogo);
router.put('/admin/header/text', protectAdmin, headerFooterController.updateHeaderText);

// ==========================================
// FOOTER ADMIN APIs (Protected)
// ==========================================
router.get('/admin/footer/settings', protectAdmin, headerFooterController.getFooterSettings);
router.put('/admin/footer/settings', protectAdmin, upload.single('footerLogo'), headerFooterController.updateFooterSettings);
router.post('/admin/footer/quick-links', protectAdmin, headerFooterController.addQuickLink);
router.put('/admin/footer/quick-links/:index', protectAdmin, headerFooterController.updateQuickLink);
router.delete('/admin/footer/quick-links/:index', protectAdmin, headerFooterController.deleteQuickLink);
router.post('/admin/footer/quick-links/reorder', protectAdmin, headerFooterController.reorderQuickLinks);

// ==========================================
// GALLERY ADMIN APIs (Protected)
// ==========================================
router.get('/admin/gallery', protectAdmin, galleryController.getAdminGallery);
router.post('/admin/gallery', protectAdmin, upload.single('galleryImage'), galleryController.createGalleryItem);
router.put('/admin/gallery/:id', protectAdmin, upload.single('galleryImage'), galleryController.updateGalleryItem);
router.delete('/admin/gallery/:id', protectAdmin, galleryController.deleteGalleryItem);
router.post('/admin/gallery/reorder', protectAdmin, galleryController.reorderGalleryItems);

// ==========================================
// CERTIFICATIONS ADMIN APIs (Protected)
// ==========================================
router.get('/admin/certifications', protectAdmin, certificationController.getAdminCertifications);
router.post('/admin/certifications', protectAdmin, upload.single('certImage'), certificationController.createCertification);
router.put('/admin/certifications/:id', protectAdmin, upload.single('certImage'), certificationController.updateCertification);
router.delete('/admin/certifications/:id', protectAdmin, certificationController.deleteCertification);
router.post('/admin/certifications/reorder', protectAdmin, certificationController.reorderCertifications);
router.patch('/admin/certifications/:id/featured', protectAdmin, certificationController.toggleFeatured);

// ==========================================
// OTHER APIs (Legacy / Existing)
// ==========================================
router.get('/content/:section', contentController.apiGetContent);
router.get('/cards', cardController.getCards);
router.patch('/cards/:id/status', protectAdmin, cardController.toggleStatus);
router.get('/hero-slider', heroController.getHeroSliderAPI);
router.get('/team', teamController.apiGetTeam);
router.get('/admin/unread-count', protectAdmin, inboxController.getUnreadCount);

module.exports = router;
