const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// Import controllers
const authController = require('../../src/controllers/authController');
const cardController = require('../../src/controllers/cardController');

// Import middleware
const { protectAdmin, isLoggedIn } = require('../../src/middleware/auth');
const { upload, handleMulterError } = require('../../src/middleware/upload');

// Configure multer for admin routes
const adminUpload = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, '../../public/uploads/admin'));
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

module.exports = router;
