const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Import controllers
const authController = require('../../src/controllers/authController');
const cardController = require('../../src/controllers/cardController');
const contentController = require('../../src/controllers/contentController');
const galleryController = require('../../src/controllers/galleryController');
const certificationController = require('../../src/controllers/certificationController');
const teamController = require('../../src/controllers/teamController');
const navigationController = require('../../src/controllers/navigationController');
const footerController = require('../../src/controllers/footerController');

// Import middleware
const { protectAdmin, isLoggedIn } = require('../../src/middleware/auth');
const { upload, handleMulterError, uploadDir } = require('../../src/middleware/upload');

// Configure multer for admin routes
const adminUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      // Use the shared upload directory from middleware
      const destDir = path.join(uploadDir, 'admin');
      
      // Ensure directory exists
      try {
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true });
        }
      } catch (err) {
        console.warn('Could not create admin upload directory:', err.message);
      }
      
      cb(null, destDir);
    },
    filename: (req, file, cb) => {
      cb(null, Date.now() + '-' + file.originalname);
    }
  }),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// ============ AUTH ROUTES ============
router.get('/login', isLoggedIn, authController.getLogin);
router.post('/login', authController.postLogin);
router.get('/logout', authController.logout);

// ============ DASHBOARD ============
router.get('/dashboard', protectAdmin, authController.getDashboard);

// ============ CARDS MANAGEMENT ============
router.get('/cards', protectAdmin, cardController.getCards);
router.get('/cards/create', protectAdmin, cardController.getCreateCard);
router.post('/cards/create', protectAdmin, adminUpload.array('images', 10), cardController.createCard);
router.get('/cards/edit/:id', protectAdmin, cardController.getEditCard);
router.post('/cards/update/:id', protectAdmin, adminUpload.array('images', 10), cardController.updateCard);
router.post('/cards/delete/:id', protectAdmin, cardController.deleteCard);
router.post('/cards/toggle-status/:id', protectAdmin, cardController.toggleStatus);

// ============ CONTENT MANAGEMENT ============
router.get('/content/manage/:section', protectAdmin, contentController.getManageContent);
router.post('/content/create', protectAdmin, adminUpload.array('images', 10), contentController.createContent);
router.post('/content/update/:id', protectAdmin, adminUpload.array('images', 10), contentController.updateContent);
router.post('/content/delete/:id', protectAdmin, contentController.deleteContent);

// ============ GALLERY MANAGEMENT ============
router.get('/gallery', protectAdmin, galleryController.getGallery);
router.post('/gallery/create', protectAdmin, adminUpload.single('image'), galleryController.createGallery);
router.post('/gallery/update/:id', protectAdmin, adminUpload.single('image'), galleryController.updateGallery);
router.post('/gallery/delete/:id', protectAdmin, galleryController.deleteGallery);

// ============ CERTIFICATIONS MANAGEMENT ============
router.get('/certifications', protectAdmin, certificationController.getCertifications);
router.post('/certifications/create', protectAdmin, adminUpload.single('certificateImage'), certificationController.createCertification);
router.post('/certifications/update/:id', protectAdmin, adminUpload.single('certificateImage'), certificationController.updateCertification);
router.post('/certifications/delete/:id', protectAdmin, certificationController.deleteCertification);

// ============ TEAM MANAGEMENT ============
router.get('/team', protectAdmin, teamController.getTeam);
router.post('/team/create', protectAdmin, adminUpload.single('photo'), teamController.createTeam);
router.post('/team/update/:id', protectAdmin, adminUpload.single('photo'), teamController.updateTeam);
router.post('/team/delete/:id', protectAdmin, teamController.deleteTeam);

// ============ NAVIGATION MANAGEMENT ============
router.get('/navigation', protectAdmin, navigationController.getNavigation);
router.post('/navigation/create', protectAdmin, navigationController.createNavigation);
router.post('/navigation/update/:id', protectAdmin, navigationController.updateNavigation);
router.post('/navigation/delete/:id', protectAdmin, navigationController.deleteNavigation);

// ============ FOOTER MANAGEMENT ============
router.get('/footer', protectAdmin, footerController.getFooter);
router.post('/footer/create', protectAdmin, footerController.createFooter);
router.post('/footer/update/:id', protectAdmin, footerController.updateFooter);

module.exports = router;
