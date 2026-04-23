const { v2: cloudinary } = require('cloudinary');

// Configure Cloudinary (credentials come from .env / Vercel env vars)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Extract the final image URL from a multer file object.
 * - If Cloudinary is active  → req.file.path  is already the full https:// URL
 * - If local disk fallback   → build a /uploads/<filename> path
 *
 * @param {Express.Multer.File} file
 * @param {string} [subfolder='']  e.g. 'hero', 'gallery', 'team'
 * @returns {string}
 */
function getImageUrl(file, subfolder = '') {
  if (!file) return '';

  // Cloudinary upload: path contains the secure HTTPS URL
  if (file.path && file.path.startsWith('http')) {
    return file.path;
  }

  // Local disk fallback
  const filename = file.filename || require('path').basename(file.path || '');
  if (!filename) return '';
  return subfolder ? `/uploads/${subfolder}/${filename}` : `/uploads/${filename}`;
}

/**
 * Delete an image from Cloudinary by its public_id.
 * Safe to call even when Cloudinary is not configured (no-op).
 *
 * @param {string} publicIdOrUrl  Either a public_id or a full Cloudinary URL
 */
async function deleteFromCloudinary(publicIdOrUrl) {
  if (!publicIdOrUrl) return;
  if (!process.env.CLOUDINARY_CLOUD_NAME) return; // not configured

  try {
    // If it's a URL, extract the public_id from the path
    let publicId = publicIdOrUrl;
    if (publicIdOrUrl.startsWith('http')) {
      // e.g. https://res.cloudinary.com/<cloud>/image/upload/v123/nusrat-international/abc.jpg
      const match = publicIdOrUrl.match(/\/upload\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/);
      if (match) publicId = match[1];
    }
    await cloudinary.uploader.destroy(publicId);
  } catch (err) {
    console.warn('Cloudinary delete failed (non-fatal):', err.message);
  }
}

module.exports = { cloudinary, getImageUrl, deleteFromCloudinary };
