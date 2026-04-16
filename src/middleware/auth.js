const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

// Protect admin routes
exports.protectAdmin = async (req, res, next) => {
  let token;

  // Check for token in cookies or headers
  if (req.cookies && req.cookies.adminToken) {
    token = req.cookies.adminToken;
  } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.redirect('/admin/login');
  }

  try {
    const { ObjectId } = require('mongodb');
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // Get DB connection
    const db = req.app.locals.getDb ? await req.app.locals.getDb() : null;
    
    if (!db) {
      throw new Error('Database not available');
    }

    // Find admin in database
    const admin = await db.collection('admins').findOne({ 
      _id: new ObjectId(decoded.id),
      isActive: true 
    });

    if (!admin) {
      res.clearCookie('adminToken');
      return res.redirect('/admin/login');
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.message);
    res.clearCookie('adminToken');
    res.redirect('/admin/login');
  }
};

// Generate JWT token
exports.generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, JWT_SECRET, {
    expiresIn: '7d'
  });
};

// Check if user is already logged in
exports.isLoggedIn = (req, res, next) => {
  if (req.cookies && req.cookies.adminToken) {
    return res.redirect('/admin/dashboard');
  }
  next();
};
