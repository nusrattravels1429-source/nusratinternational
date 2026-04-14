const { protectAdmin, generateToken } = require('../middleware/auth');
const crypto = require('crypto');

// GET /admin/login - Show login page
exports.getLogin = (req, res) => {
  res.render('admin/login', { 
    error: null,
    success: null 
  });
};

// POST /admin/login - Handle login
exports.postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validation
    if (!username || !password) {
      return res.render('admin/login', { 
        error: 'Please provide username and password',
        success: null 
      });
    }

    // Get DB connection
    const db = await req.app.locals.getDb();
    
    // Find admin by username or email
    const admin = await db.collection('admins').findOne({
      $or: [
        { username: username },
        { email: username.toLowerCase() }
      ]
    });

    if (!admin) {
      return res.render('admin/login', { 
        error: 'Invalid credentials',
        success: null 
      });
    }

    if (!admin.isActive) {
      return res.render('admin/login', { 
        error: 'Account is deactivated. Please contact administrator.',
        success: null 
      });
    }

    // Compare password
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.render('admin/login', { 
        error: 'Invalid credentials',
        success: null 
      });
    }

    // Update last login
    await db.collection('admins').updateOne(
      { _id: admin._id },
      { $set: { lastLogin: new Date() } }
    );

    // Generate token
    const token = generateToken(admin._id);

    // Set cookie
    res.cookie('adminToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.redirect('/admin/dashboard');
  } catch (error) {
    console.error('Login error:', error);
    res.render('admin/login', { 
      error: 'An error occurred during login',
      success: null 
    });
  }
};

// GET /admin/logout - Handle logout
exports.logout = (req, res) => {
  res.clearCookie('adminToken');
  res.redirect('/admin/login');
};

// GET /admin/dashboard - Show dashboard
exports.getDashboard = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    
    // Get counts for dashboard
    const travelCount = await db.collection('cards').countDocuments({ type: 'travel', isActive: true });
    const hajjCount = await db.collection('cards').countDocuments({ type: 'hajj', isActive: true });
    const workCount = await db.collection('cards').countDocuments({ type: 'work', isActive: true });
    const galleryCount = await db.collection('galleryitems').countDocuments({ isActive: true });
    const certificationCount = await db.collection('certifications').countDocuments({ isActive: true });
    const teamCount = await db.collection('teammembers').countDocuments({ isActive: true });

    res.render('admin/dashboard', {
      admin: req.admin,
      stats: {
        travel: travelCount,
        hajj: hajjCount,
        work: workCount,
        gallery: galleryCount,
        certifications: certificationCount,
        team: teamCount
      }
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).send('Error loading dashboard');
  }
};
