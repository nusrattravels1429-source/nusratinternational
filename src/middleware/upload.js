const multer = require('multer');
const path = require('path');
const fs = require('fs');
const os = require('os');
const { cloudinary } = require('../config/cloudinary');
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Check if Cloudinary is configured
const isCloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

// Define local upload dir (used only when Cloudinary is NOT configured)
const uploadDir = process.env.VERCEL
  ? path.join(os.tmpdir(), 'uploads')
  : path.join(__dirname, '../../public/uploads');

let storage;

if (isCloudinaryConfigured) {
  console.log('☁️  Cloudinary storage active — uploads go to cloud_name:', process.env.CLOUDINARY_CLOUD_NAME);

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: 'nusrat-international',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
      transformation: [{ quality: 'auto', fetch_format: 'auto' }]
    }
  });
} else {
  console.warn('⚠️  Cloudinary NOT configured — falling back to local disk storage');

  try {
    if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

    const subDirs = ['admin', 'packages', 'gallery', 'certifications', 'team', 'content', 'hero'];
    subDirs.forEach(dir => {
      const subDir = path.join(uploadDir, dir);
      if (!fs.existsSync(subDir)) fs.mkdirSync(subDir, { recursive: true });
    });
  } catch (err) {
    console.error('Failed to create local upload dirs:', err.message);
  }

  storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
}

// File type filter — only accept images
const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed (jpeg, jpg, png, gif, webp)'));
  }
};

// Main multer instance
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB
  fileFilter
});

// Error handler for multer errors
const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10 MB.' });
    }
    return res.status(400).json({ error: err.message });
  }
  if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
};

module.exports = { upload, handleMulterError, uploadDir, isCloudinaryConfigured };
