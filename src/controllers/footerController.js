const { protectAdmin } = require('../middleware/auth');

// GET /admin/footer - Get footer settings
exports.getFooter = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    
    // Get the first (main) footer setting
    const footerSettings = await db.collection('footersettings').findOne({ isActive: true });
    
    // If no settings exist, create default
    let footer = footerSettings;
    if (!footer) {
      const defaultFooter = {
        companyName: { en: 'Nusrat International', bn: '' },
        tagline: { en: 'Your trusted travel partner', bn: '' },
        contactInfo: {
          address: { en: '', bn: '' },
          phone: '',
          email: ''
        },
        socialLinks: {},
        quickLinks: [],
        copyrightText: { en: '© 2024 Nusrat International. All rights reserved.', bn: '' },
        isActive: true,
        updatedAt: new Date()
      };
      
      const result = await db.collection('footersettings').insertOne(defaultFooter);
      footer = { _id: result.insertedId, ...defaultFooter };
    }
    
    res.render('admin/footer/form', {
      admin: req.admin,
      footer
    });
  } catch (error) {
    console.error('Get footer error:', error);
    res.status(500).send('Error loading footer settings');
  }
};

// POST /admin/footer/update - Update footer settings
exports.updateFooter = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      companyNameEn, companyNameBn,
      taglineEn, taglineBn,
      addressEn, addressBn,
      phone, email,
      facebook, youtube, instagram, whatsapp, linkedin, twitter,
      mapEmbedUrl,
      copyrightTextEn, copyrightTextBn,
      isActive
    } = req.body;
    
    // Parse quick links from form
    const quickLinks = [];
    const qlLabelsEn = req.body.quickLinksLabelEn || [];
    const qlLabelsBn = req.body.quickLinksLabelBn || [];
    const qlUrls = req.body.quickLinksUrl || [];
    
    for (let i = 0; i < qlLabelsEn.length; i++) {
      if (qlLabelsEn[i]?.trim()) {
        quickLinks.push({
          label: { en: qlLabelsEn[i], bn: qlLabelsBn[i] || '' },
          url: qlUrls[i] || '#'
        });
      }
    }
    
    const updateData = {
      companyName: { en: companyNameEn || '', bn: companyNameBn || '' },
      tagline: { en: taglineEn || '', bn: taglineBn || '' },
      contactInfo: {
        address: { en: addressEn || '', bn: addressBn || '' },
        phone: phone || '',
        email: email || ''
      },
      socialLinks: {
        facebook: facebook || '',
        youtube: youtube || '',
        instagram: instagram || '',
        whatsapp: whatsapp || '',
        linkedin: linkedin || '',
        twitter: twitter || ''
      },
      mapEmbedUrl: mapEmbedUrl || '',
      quickLinks,
      copyrightText: { en: copyrightTextEn || '', bn: copyrightTextBn || '' },
      isActive: isActive === 'on',
      updatedAt: new Date()
    };
    
    // Get existing footer or create new one
    const existingFooter = await db.collection('footersettings').findOne({});
    
    if (existingFooter) {
      await db.collection('footersettings').updateOne(
        { _id: existingFooter._id },
        { $set: updateData }
      );
    } else {
      await db.collection('footersettings').insertOne(updateData);
    }
    
    res.redirect('/admin/footer');
  } catch (error) {
    console.error('Update footer error:', error);
    res.status(500).send('Error updating footer settings');
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
