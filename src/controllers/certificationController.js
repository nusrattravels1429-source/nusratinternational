// Fix ObjectId usage - use 'new' keyword consistently
const { ObjectId } = require('mongodb');

// GET /admin/certifications - List all certifications
exports.getCertifications = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { status = 'all' } = req.query;

    let query = {};
    if (status === 'active') query.isActive = true;
    else if (status === 'inactive') query.isActive = false;

    const certifications = await db.collection('certifications').find(query)
      .sort({ order: 1, isFeatured: -1, createdAt: -1 })
      .toArray();

    res.render('admin/certifications/manage', {
      admin: req.admin,
      items: certifications,
      currentStatus: status
    });
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).send('Error loading certifications: ' + error.message);
  }
};

// POST /admin/certifications/create - Create new certification
exports.createCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { titleEn, titleBn, tagEn, tagBn, code, isFeatured, isActive, order } = req.body;

    // The field names from multer upload.fields([{name:'logo'}, {name:'certificate'}])
    // req.files is an object keyed by field name
    let logoUrl = '';
    let certificateUrl = '';

    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        const f = req.files.logo[0];
        logoUrl = f.path || ('/uploads/' + f.filename);
      }
      if (req.files.certificate && req.files.certificate[0]) {
        const f = req.files.certificate[0];
        certificateUrl = f.path || ('/uploads/' + f.filename);
      }
      // Also handle single file named 'certificateImage' (legacy)
      if (req.files.certificateImage && req.files.certificateImage[0]) {
        const f = req.files.certificateImage[0];
        certificateUrl = f.path || ('/uploads/' + f.filename);
      }
    }

    const certification = {
      title: { en: titleEn || '', bn: titleBn || '' },
      tag: { en: tagEn || '', bn: tagBn || '' },
      code: code || '',
      logoUrl,
      certificateImage: certificateUrl,
      isFeatured: isFeatured === 'on',
      isActive: isActive !== 'false',
      order: order ? parseInt(order) : 0,
      createdAt: new Date()
    };

    await db.collection('certifications').insertOne(certification);
    res.redirect('/admin/certifications');
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).send('Error creating certification: ' + error.message);
  }
};

// POST /admin/certifications/update/:id - Update certification
exports.updateCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { titleEn, titleBn, tagEn, tagBn, code, isFeatured, isActive, order } = req.body;

    let logoUrl = req.body.existingLogo || '';
    let certificateUrl = req.body.existingCertificate || '';

    if (req.files) {
      if (req.files.logo && req.files.logo[0]) {
        const f = req.files.logo[0];
        logoUrl = f.path || ('/uploads/' + f.filename);
      }
      if (req.files.certificate && req.files.certificate[0]) {
        const f = req.files.certificate[0];
        certificateUrl = f.path || ('/uploads/' + f.filename);
      }
      if (req.files.certificateImage && req.files.certificateImage[0]) {
        const f = req.files.certificateImage[0];
        certificateUrl = f.path || ('/uploads/' + f.filename);
      }
    }

    const updateData = {
      title: { en: titleEn || '', bn: titleBn || '' },
      tag: { en: tagEn || '', bn: tagBn || '' },
      code: code || '',
      logoUrl,
      certificateImage: certificateUrl,
      isFeatured: isFeatured === 'on',
      isActive: isActive !== 'false',
      order: order ? parseInt(order) : 0,
      updatedAt: new Date()
    };

    await db.collection('certifications').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    res.redirect('/admin/certifications');
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).send('Error updating certification: ' + error.message);
  }
};

// POST /admin/certifications/delete/:id - Delete certification
exports.deleteCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    await db.collection('certifications').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect('/admin/certifications');
    }
  } catch (error) {
    console.error('Delete certification error:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ success: false, error: 'Error deleting certification' });
    } else {
      res.status(500).send('Error deleting certification: ' + error.message);
    }
  }
};

// POST /admin/certifications/toggle-featured/:id
exports.toggleFeatured = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const cert = await db.collection('certifications').findOne({ _id: new ObjectId(req.params.id) });
    if (!cert) return res.status(404).json({ success: false, error: 'Not found' });

    await db.collection('certifications').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isFeatured: !cert.isFeatured } }
    );

    res.json({ success: true, isFeatured: !cert.isFeatured });
  } catch (error) {
    console.error('Toggle featured error:', error);
    res.status(500).json({ success: false, error: 'Error toggling featured' });
  }
};

// API: GET /api/certifications - Get all certifications
exports.apiGetCertifications = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { isActive, isFeatured } = req.query;

    let query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isFeatured !== undefined) query.isFeatured = isFeatured === 'true';

    const certifications = await db.collection('certifications').find(query)
      .sort({ order: 1, isFeatured: -1, createdAt: -1 })
      .toArray();

    res.json({ success: true, certifications });
  } catch (error) {
    console.error('API get certifications error:', error);
    res.status(500).json({ success: false, error: 'Error loading certifications' });
  }
};

// Aliases for admin routes
exports.manageCertifications = exports.getCertifications;
