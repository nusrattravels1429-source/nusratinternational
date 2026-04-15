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

// --- Auth Middleware ---
const { protectAdmin } = require('../../src/middleware/auth');

// --- Multer Configuration (File Upload) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    // Ensure directory exists
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|webp/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'));
  }
};

// Define upload middleware HERE so it's not undefined
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: fileFilter
});

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
router.post('/cards', protectAdmin, upload.array('images', 5), cardController.createCard);
router.post('/cards/:id', protectAdmin, upload.array('images', 5), cardController.updateCard);
router.get('/cards/delete/:id', protectAdmin, cardController.deleteCard);
router.patch('/cards/:id/status', protectAdmin, cardController.toggleStatus);

// Gallery Management
router.get('/gallery', protectAdmin, galleryController.manageGallery);
router.post('/gallery', protectAdmin, upload.single('image'), galleryController.createGalleryItem);
router.post('/gallery/:id', protectAdmin, upload.single('image'), galleryController.updateGalleryItem);
router.get('/gallery/delete/:id', protectAdmin, galleryController.deleteGalleryItem);

// Team Management
router.get('/team', protectAdmin, teamController.manageTeam);
router.post('/team/founder', protectAdmin, upload.single('image'), teamController.updateFounder);
router.post('/team/member', protectAdmin, upload.single('image'), teamController.createMember);
router.post('/team/member/:id', protectAdmin, upload.single('image'), teamController.updateMember);
router.get('/team/delete/:id', protectAdmin, teamController.deleteMember);

// Certification Management
router.get('/certifications', protectAdmin, certificationController.manageCertifications);
router.post('/certifications', protectAdmin, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), certificationController.createCertification);
router.post('/certifications/:id', protectAdmin, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), certificationController.updateCertification);
router.get('/certifications/delete/:id', protectAdmin, certificationController.deleteCertification);

// Navigation Management
router.get('/navigation', protectAdmin, navigationController.manageNavigation);
router.post('/navigation', protectAdmin, navigationController.createLink);
router.post('/navigation/:id', protectAdmin, navigationController.updateLink);
router.get('/navigation/delete/:id', protectAdmin, navigationController.deleteLink);

// Footer Management
router.get('/footer', protectAdmin, footerController.manageFooter);
router.post('/footer', protectAdmin, upload.single('logo'), footerController.updateFooter);

module.exports = router;
