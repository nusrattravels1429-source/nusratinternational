const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

// --- Routes ---

// Auth
router.get('/login', authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);
router.get('/dashboard', protectAdmin, authController.getDashboard);

// Content Management (Homepage, Ticketing, About)
router.get('/content/:section', protectAdmin, contentController.manageContent);
router.post('/content/homepage', protectAdmin, upload.single('heroImage'), contentController.updateHomepage);
router.post('/content/ticketing', protectAdmin, upload.single('bgImage'), contentController.updateTicketing);
router.post('/content/about', protectAdmin, upload.single('founderImage'), contentController.updateAbout);

// Cards Management (Work, Travel, Hajj)
router.get('/cards', protectAdmin, cardController.manageCards);
router.get('/cards/create', protectAdmin, cardController.showCreateCard);
router.post('/cards/create', protectAdmin, upload.array('images', 5), cardController.createCard);
router.get('/cards/edit/:id', protectAdmin, cardController.showEditCard);
router.post('/cards/update/:id', protectAdmin, upload.array('images', 5), cardController.updateCard);
router.post('/cards/delete/:id', protectAdmin, cardController.deleteCard);
router.post('/cards/toggle-status/:id', protectAdmin, cardController.toggleStatus);

// Gallery Management
router.get('/gallery', protectAdmin, galleryController.manageGallery);
router.post('/gallery/create', protectAdmin, upload.single('image'), galleryController.createGalleryItem);
router.post('/gallery/update/:id', protectAdmin, upload.single('image'), galleryController.updateGalleryItem);
router.post('/gallery/delete/:id', protectAdmin, galleryController.deleteGalleryItem);

// Team Management
router.get('/team', protectAdmin, teamController.manageTeam);
router.post('/team/founder', protectAdmin, upload.single('image'), teamController.updateFounder);
router.post('/team/create', protectAdmin, upload.single('image'), teamController.createMember);
router.post('/team/update/:id', protectAdmin, upload.single('image'), teamController.updateMember);
router.post('/team/delete/:id', protectAdmin, teamController.deleteMember);

// Certification Management
router.get('/certifications', protectAdmin, certificationController.manageCertifications);
router.post('/certifications/create', protectAdmin, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), certificationController.createCertification);
router.post('/certifications/update/:id', protectAdmin, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), certificationController.updateCertification);
router.post('/certifications/delete/:id', protectAdmin, certificationController.deleteCertification);

// Navigation Management
router.get('/navigation', protectAdmin, navigationController.manageNavigation);
router.post('/navigation/create', protectAdmin, navigationController.createLink);
router.post('/navigation/update/:id', protectAdmin, navigationController.updateLink);
router.post('/navigation/delete/:id', protectAdmin, navigationController.deleteLink);

// Footer Management
router.get('/footer', protectAdmin, footerController.manageFooter);
router.post('/footer/create', protectAdmin, upload.single('logo'), footerController.createFooter);
router.post('/footer/update/:id', protectAdmin, upload.single('logo'), footerController.updateFooter);

module.exports = router;
