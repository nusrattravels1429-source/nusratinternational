const { protectAdmin } = require('../middleware/auth');

// GET /admin/footer - Get footer settings
exports.getFooter = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    let settings = await db.collection('footersettings').findOne({});

    if (!settings) {
      // Create default settings
      const defaultFooter = {
        companyName: { en: 'Nusrat International', bn: 'নুসরাত ইন্টারন্যাশনাল' },
        address: { en: '', bn: '' },
        phone: '',
        email: '',
        whatsapp: '',
        socialLinks: {},
        aboutText: { en: '', bn: '' },
        copyrightText: '© 2024 Nusrat International. All rights reserved.',
        businessHours: {
          mon: { open: "09:00", close: "18:00", closed: false },
          tue: { open: "09:00", close: "18:00", closed: false },
          wed: { open: "09:00", close: "18:00", closed: false },
          thu: { open: "09:00", close: "18:00", closed: false },
          fri: { open: "09:00", close: "18:00", closed: false },
          sat: { open: "09:00", close: "18:00", closed: false },
          sun: { open: "", close: "", closed: true }
        },
        isActive: true,
        updatedAt: new Date()
      };
      const result = await db.collection('footersettings').insertOne(defaultFooter);
      settings = { _id: result.insertedId, ...defaultFooter };
    }

    res.render('admin/footer/manage', {
      admin: req.admin,
      settings
    });
  } catch (error) {
    console.error('Get footer error:', error);
    res.status(500).send('Error loading footer settings: ' + error.message);
  }
};


// POST /admin/footer/update - Update footer settings (upsert)
exports.updateFooter = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { companyNameEn, companyNameBn, addressEn, addressBn, phone, email, whatsapp,
      facebook, youtube, instagram, linkedin, twitter, aboutTextEn, aboutTextBn, copyrightText } = req.body;

    // Handle logo upload if present
    let logoUrl = req.body.existingLogo || '';
    if (req.file) {
      logoUrl = req.file.path || ('/uploads/' + req.file.filename);
    }

    const updateData = {
      companyName: { en: companyNameEn || '', bn: companyNameBn || '' },
      address: { en: addressEn || '', bn: addressBn || '' },
      phone: phone || '',
      email: email || '',
      whatsapp: whatsapp || '',
      logoUrl,
      socialLinks: {
        facebook: facebook || '',
        youtube: youtube || '',
        instagram: instagram || '',
        linkedin: linkedin || '',
        twitter: twitter || ''
      },
      aboutText: { en: aboutTextEn || '', bn: aboutTextBn || '' },
      copyrightText: copyrightText || '',
      businessHours: req.body.businessHours_json ? JSON.parse(req.body.businessHours_json) : null,
      isActive: true,
      updatedAt: new Date()
    };

    // Upsert - update existing or create new
    await db.collection('footersettings').updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    res.redirect('/admin/footer');
  } catch (error) {
    console.error('Update footer error:', error);
    res.status(500).send('Error updating footer: ' + error.message);
  }
};


// API: GET /api/footer - Get footer settings
exports.apiGetFooter = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    
    const footer = await db.collection('footersettings').findOne({ isActive: true });
    
    if (!footer) {
      return res.json({ success: true, footer: null });
    }
    
    res.json({ success: true, footer });
  } catch (error) {
    console.error('API get footer error:', error);
    res.status(500).json({ success: false, error: 'Error loading footer' });
  }
};

// API: PUT /api/footer - Update footer settings
exports.apiUpdateFooter = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      companyName, tagline, contactInfo, socialLinks, 
      mapEmbedUrl, quickLinks, copyrightText, isActive 
    } = req.body;
    
    const updateData = {
      updatedAt: new Date()
    };
    
    if (companyName) updateData.companyName = companyName;
    if (tagline) updateData.tagline = tagline;
    if (contactInfo) updateData.contactInfo = contactInfo;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (mapEmbedUrl !== undefined) updateData.mapEmbedUrl = mapEmbedUrl;
    if (quickLinks) updateData.quickLinks = quickLinks;
    if (copyrightText) updateData.copyrightText = copyrightText;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    const existingFooter = await db.collection('footersettings').findOne({});
    
    if (existingFooter) {
      await db.collection('footersettings').updateOne(
        { _id: existingFooter._id },
        { $set: updateData }
      );
      
      const updated = await db.collection('footersettings').findOne({ 
        _id: existingFooter._id 
      });
      
      res.json({ success: true, footer: updated });
    } else {
      const result = await db.collection('footersettings').insertOne(updateData);
      const created = await db.collection('footersettings').findOne({ 
        _id: result.insertedId 
      });
      
      res.json({ success: true, footer: created });
    }
  } catch (error) {
    console.error('API update footer error:', error);
    res.status(500).json({ success: false, error: 'Error updating footer' });
  }
};

// Aliases for admin routes
exports.manageFooter = exports.getFooter;
exports.createFooter = exports.updateFooter;
