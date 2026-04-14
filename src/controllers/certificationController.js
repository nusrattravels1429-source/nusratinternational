const { protectAdmin } = require('../middleware/auth');

// GET /admin/certifications - List all certifications
exports.getCertifications = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { status = 'all' } = req.query;
    
    let query = {};
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    const certifications = await db.collection('certifications').find(query)
      .sort({ order: 1, isFeatured: -1, createdAt: -1 })
      .toArray();
    
    res.render('admin/certifications/list', {
      admin: req.admin,
      certifications,
      currentStatus: status
    });
  } catch (error) {
    console.error('Get certifications error:', error);
    res.status(500).send('Error loading certifications');
  }
};

// GET /admin/certifications/create - Show create form
exports.getCreateCertification = (req, res) => {
  res.render('admin/certifications/form', {
    admin: req.admin,
    certification: null,
    action: 'create'
  });
};

// POST /admin/certifications/create - Create new certification
exports.createCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      titleEn, titleBn, descriptionEn, descriptionBn,
      issuingOrganizationEn, issuingOrganizationBn,
      issueDate, expiryDate, certificateNumber,
      isFeatured, isActive, order
    } = req.body;
    
    // Handle image uploads
    const logoUrl = req.files?.find(f => f.fieldname === 'logo')?.filename;
    const certificateImageUrl = req.files?.find(f => f.fieldname === 'certificateImage')?.filename;
    
    const certification = {
      title: { en: titleEn, bn: titleBn || '' },
      description: { en: descriptionEn || '', bn: descriptionBn || '' },
      issuingOrganization: { en: issuingOrganizationEn || '', bn: issuingOrganizationBn || '' },
      logo: {
        url: logoUrl ? '/uploads/' + logoUrl : '',
        alt: titleEn
      },
      certificateImage: {
        url: certificateImageUrl ? '/uploads/' + certificateImageUrl : '',
        alt: titleEn + ' Certificate'
      },
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      certificateNumber: certificateNumber || '',
      isFeatured: isFeatured === 'on',
      isActive: isActive === 'on',
      order: order ? parseInt(order) : 0,
      createdAt: new Date()
    };
    
    const result = await db.collection('certifications').insertOne(certification);
    
    res.redirect('/admin/certifications');
  } catch (error) {
    console.error('Create certification error:', error);
    res.status(500).send('Error creating certification');
  }
};

// GET /admin/certifications/edit/:id - Show edit form
exports.getEditCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const certification = await db.collection('certifications').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!certification) {
      return res.status(404).send('Certification not found');
    }
    
    res.render('admin/certifications/form', {
      admin: req.admin,
      certification,
      action: 'edit'
    });
  } catch (error) {
    console.error('Get edit certification error:', error);
    res.status(500).send('Error loading certification');
  }
};

// POST /admin/certifications/update/:id - Update certification
exports.updateCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { 
      titleEn, titleBn, descriptionEn, descriptionBn,
      issuingOrganizationEn, issuingOrganizationBn,
      issueDate, expiryDate, certificateNumber,
      isFeatured, isActive, order,
      existingLogo, existingCertificateImage
    } = req.body;
    
    // Handle logo
    let logoUrl = existingLogo || '';
    const logoFile = req.files?.find(f => f.fieldname === 'logo');
    if (logoFile) {
      logoUrl = '/uploads/' + logoFile.filename;
    }
    
    // Handle certificate image
    let certificateImageUrl = existingCertificateImage || '';
    const certImageFile = req.files?.find(f => f.fieldname === 'certificateImage');
    if (certImageFile) {
      certificateImageUrl = '/uploads/' + certImageFile.filename;
    }
    
    const updateData = {
      title: { en: titleEn, bn: titleBn || '' },
      description: { en: descriptionEn || '', bn: descriptionBn || '' },
      issuingOrganization: { en: issuingOrganizationEn || '', bn: issuingOrganizationBn || '' },
      logo: {
        url: logoUrl,
        alt: titleEn
      },
      certificateImage: {
        url: certificateImageUrl,
        alt: titleEn + ' Certificate'
      },
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      certificateNumber: certificateNumber || '',
      isFeatured: isFeatured === 'on',
      isActive: isActive === 'on',
      order: order ? parseInt(order) : 0,
      createdAt: new Date()
    };
    
    await db.collection('certifications').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    res.redirect('/admin/certifications');
  } catch (error) {
    console.error('Update certification error:', error);
    res.status(500).send('Error updating certification');
  }
};

// POST /admin/certifications/delete/:id - Delete certification
exports.deleteCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
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
      res.status(500).send('Error deleting certification');
    }
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

// API: POST /api/certifications - Create certification
exports.apiCreateCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      title, description, issuingOrganization, logo, certificateImage,
      issueDate, expiryDate, certificateNumber, isFeatured, order 
    } = req.body;
    
    const certification = {
      title: { en: title?.en || '', bn: title?.bn || '' },
      description: { en: description?.en || '', bn: description?.bn || '' },
      issuingOrganization: { en: issuingOrganization?.en || '', bn: issuingOrganization?.bn || '' },
      logo: logo || { url: '', alt: '' },
      certificateImage: certificateImage || { url: '', alt: '' },
      issueDate: issueDate ? new Date(issueDate) : null,
      expiryDate: expiryDate ? new Date(expiryDate) : null,
      certificateNumber: certificateNumber || '',
      isFeatured: isFeatured || false,
      isActive: true,
      order: order || 0,
      createdAt: new Date()
    };
    
    const result = await db.collection('certifications').insertOne(certification);
    
    res.json({ success: true, certification: result.ops[0] });
  } catch (error) {
    console.error('API create certification error:', error);
    res.status(500).json({ success: false, error: 'Error creating certification' });
  }
};

// API: PUT /api/certifications/:id - Update certification
exports.apiUpdateCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { title, description, logo, certificateImage, issueDate, expiryDate, isFeatured, isActive, order } = req.body;
    
    const updateData = {};
    
    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (logo) updateData.logo = logo;
    if (certificateImage) updateData.certificateImage = certificateImage;
    if (issueDate) updateData.issueDate = new Date(issueDate);
    if (expiryDate) updateData.expiryDate = new Date(expiryDate);
    if (isFeatured !== undefined) updateData.isFeatured = isFeatured;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;
    
    await db.collection('certifications').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    const updated = await db.collection('certifications').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    res.json({ success: true, certification: updated });
  } catch (error) {
    console.error('API update certification error:', error);
    res.status(500).json({ success: false, error: 'Error updating certification' });
  }
};

// API: DELETE /api/certifications/:id - Delete certification
exports.apiDeleteCertification = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
    await db.collection('certifications').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('API delete certification error:', error);
    res.status(500).json({ success: false, error: 'Error deleting certification' });
  }
};

// Aliases for admin routes
exports.manageCertifications = exports.getCertifications;
