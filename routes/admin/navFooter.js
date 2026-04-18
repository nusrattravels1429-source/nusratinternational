const express = require('express');
const router = express.Router();
const navFooterController = require('../../src/controllers/navFooterController');
const { protectAdmin } = require('../../src/middleware/auth');
const { upload } = require('../../src/middleware/upload');

// ==========================================
// NAVBAR ROUTES (prefixed with /api/admin/navbar in index.js)
// ==========================================
router.get('/navbar', protectAdmin, navFooterController.getNavbar);
router.post('/navbar', protectAdmin, upload.none(), navFooterController.createNavbarLink);
router.put('/navbar/:id', protectAdmin, upload.none(), navFooterController.updateNavbarLink);
router.delete('/navbar/:id', protectAdmin, navFooterController.deleteNavbarLink);
router.post('/navbar/reorder', protectAdmin, express.json(), navFooterController.reorderNavbarLinks);

// ==========================================
// FOOTER ROUTES (prefixed with /api/admin/footer in index.js)
// ==========================================
router.get('/footer', protectAdmin, navFooterController.getFooter);
// Use upload.any() to handle multipart/form-data payloads dynamically
router.put('/footer', protectAdmin, upload.any(), navFooterController.updateFooter);

module.exports = router;
