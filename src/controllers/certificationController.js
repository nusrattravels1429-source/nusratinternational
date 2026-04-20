const { ObjectId } = require('mongodb');

// ==========================================
// VIEWS (Admin)
// ==========================================
exports.manageCertifications = async (req, res) => {
  res.render('admin/certifications/manage', { 
    admin: req.admin || req.session?.admin || { username: 'Admin' }, 
    activePage: 'certifications' 
  });
};

// ==========================================
// ADMIN API ROUTES
// ==========================================

// GET /api/admin/certifications
exports.getAdminCertifications = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const certifications = await db.collection('certifications')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    res.json({ success: true, data: certifications || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch certifications', error: error.message });
  }
};

// POST /api/admin/certifications
exports.createCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      titleEn, titleBn, 
      tagEn, tagBn, 
      code, 
      descriptionEn, descriptionBn, 
      issuingAuthority, 
      yearAwarded, 
      isFeatured, 
      isActive 
    } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Certificate image is required' });
    }

    const imageUrl = req.file.path || `/uploads/certifications/${req.file.filename}`;

    const certification = {
      title: { en: titleEn || '', bn: titleBn || '' },
      tag: { en: tagEn || '', bn: tagBn || '' },
      code: code || '',
      imageUrl,
      description: { en: descriptionEn || '', bn: descriptionBn || '' },
      issuingAuthority: issuingAuthority || '',
      yearAwarded: yearAwarded ? parseInt(yearAwarded, 10) : new Date().getFullYear(),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isActive: isActive === 'true' || isActive === true,
      order: Date.now(), // default to bottom of list
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('certifications').insertOne(certification);
    res.json({ success: true, message: 'Certification created successfully', data: { _id: result.insertedId, ...certification } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create certification', error: error.message });
  }
};

// PUT /api/admin/certifications/:id
exports.updateCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      titleEn, titleBn, 
      tagEn, tagBn, 
      code, 
      descriptionEn, descriptionBn, 
      issuingAuthority, 
      yearAwarded, 
      isFeatured, 
      isActive 
    } = req.body;

    const updateData = {
      title: { en: titleEn || '', bn: titleBn || '' },
      tag: { en: tagEn || '', bn: tagBn || '' },
      code: code || '',
      description: { en: descriptionEn || '', bn: descriptionBn || '' },
      issuingAuthority: issuingAuthority || '',
      yearAwarded: yearAwarded ? parseInt(yearAwarded, 10) : new Date().getFullYear(),
      isFeatured: isFeatured === 'true' || isFeatured === true,
      isActive: isActive === 'true' || isActive === true,
      updatedAt: new Date()
    };

    if (req.file) {
      updateData.imageUrl = req.file.path || `/uploads/certifications/${req.file.filename}`;
    }

    const result = await db.collection('certifications').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    res.json({ success: true, message: 'Certification updated successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update certification', error: error.message });
  }
};

// DELETE /api/admin/certifications/:id
exports.deleteCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const result = await db.collection('certifications').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    res.json({ success: true, message: 'Certification deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete certification', error: error.message });
  }
};

// POST /api/admin/certifications/reorder
exports.reorderCertifications = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { items } = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    const bulkOps = items.map(item => ({
      updateOne: {
        filter: { _id: new ObjectId(item._id) },
        update: { $set: { order: parseInt(item.order, 10), updatedAt: new Date() } }
      }
    }));

    if (bulkOps.length > 0) {
      await db.collection('certifications').bulkWrite(bulkOps);
    }

    res.json({ success: true, message: 'Certifications reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reorder certifications', error: error.message });
  }
};

// PATCH /api/admin/certifications/:id/featured
exports.toggleFeatured = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const cert = await db.collection('certifications').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!cert) {
      return res.status(404).json({ success: false, message: 'Certification not found' });
    }

    await db.collection('certifications').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isFeatured: !cert.isFeatured, updatedAt: new Date() } }
    );

    res.json({ success: true, message: 'Toggle successful', data: { isFeatured: !cert.isFeatured } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to toggle featured status', error: error.message });
  }
};


// ==========================================
// PUBLIC API ROUTES
// ==========================================

// GET /api/public/certifications
exports.getPublicCertifications = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { featured } = req.query;

    let query = { isActive: true };
    if (featured === 'true') {
      query.isFeatured = true;
    }

    const certifications = await db.collection('certifications')
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    res.json({ success: true, data: certifications || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch public certifications', error: error.message });
  }
};
