const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// --- Controllers ---
const authController = require('../../controllers/authController');
const contentController = require('../../controllers/contentController');
const cardController = require('../../controllers/cardController');
const galleryController = require('../../controllers/galleryController');
const teamController = require('../../controllers/teamController');
const certificationController = require('../../controllers/certificationController');
const navigationController = require('../../controllers/navigationController');
const footerController = require('../../controllers/footerController');

// --- Auth Middleware ---
const { verifyToken } = require('../../middleware/authMiddleware');

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
router.get('/dashboard', verifyToken, authController.getDashboard);

// Content Management (Homepage, Ticketing, About)
router.get('/content', verifyToken, contentController.manageContent);
router.post('/content/homepage', verifyToken, upload.single('heroImage'), contentController.updateHomepage);
router.post('/content/ticketing', verifyToken, upload.single('bgImage'), contentController.updateTicketing);
router.post('/content/about', verifyToken, upload.single('founderImage'), contentController.updateAbout);

// Cards Management (Work, Travel, Hajj)
router.get('/cards', verifyToken, cardController.manageCards);
router.post('/cards', verifyToken, upload.array('images', 5), cardController.createCard);
router.post('/cards/:id', verifyToken, upload.array('images', 5), cardController.updateCard);
router.get('/cards/delete/:id', verifyToken, cardController.deleteCard);
router.patch('/cards/:id/status', verifyToken, cardController.toggleStatus);

// Gallery Management
router.get('/gallery', verifyToken, galleryController.manageGallery);
router.post('/gallery', verifyToken, upload.single('image'), galleryController.createGalleryItem);
router.post('/gallery/:id', verifyToken, upload.single('image'), galleryController.updateGalleryItem);
router.get('/gallery/delete/:id', verifyToken, galleryController.deleteGalleryItem);

// Team Management
router.get('/team', verifyToken, teamController.manageTeam);
router.post('/team/founder', verifyToken, upload.single('image'), teamController.updateFounder);
router.post('/team/member', verifyToken, upload.single('image'), teamController.createMember);
router.post('/team/member/:id', verifyToken, upload.single('image'), teamController.updateMember);
router.get('/team/delete/:id', verifyToken, teamController.deleteMember);

// Certification Management
router.get('/certifications', verifyToken, certificationController.manageCertifications);
router.post('/certifications', verifyToken, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), certificationController.createCertification);
router.post('/certifications/:id', verifyToken, upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'certificate', maxCount: 1 }]), certificationController.updateCertification);
router.get('/certifications/delete/:id', verifyToken, certificationController.deleteCertification);

// Navigation Management
router.get('/navigation', verifyToken, navigationController.manageNavigation);
router.post('/navigation', verifyToken, navigationController.createLink);
router.post('/navigation/:id', verifyToken, navigationController.updateLink);
router.get('/navigation/delete/:id', verifyToken, navigationController.deleteLink);

// Footer Management
router.get('/footer', verifyToken, footerController.manageFooter);
router.post('/footer', verifyToken, upload.single('logo'), footerController.updateFooter);

module.exports = router;
