const app = require('../app');

module.exports = app;

// IMPORTANT: Disable Vercel's default body parser so Multer can read the raw stream for file uploads
module.exports.config = {
  api: {
    bodyParser: false,
  },
};
