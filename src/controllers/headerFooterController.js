const { ObjectId } = require('mongodb');

// ==========================================
// VIEWS (Admin)
// ==========================================
exports.manageHeaderFooter = async (req, res) => {
  res.render('admin/header-footer/manage', {
    admin: req.admin || req.session?.admin || { username: 'Admin' },
    activePage: 'header-footer'
  });
};

// ==========================================
// HEADER/NAVBAR ADMIN APIs
// ==========================================

// GET /api/admin/header/nav
exports.getNavItems = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const items = await db.collection('navitems')
      .find({ section: 'navbar' })
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    res.json({ success: true, data: items || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch nav items', error: error.message });
  }
};

// POST /api/admin/header/nav
exports.createNavItem = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { labelEn, labelBn, link, isExternal, isActive } = req.body;

    const navItem = {
      label: { en: labelEn || '', bn: labelBn || '' },
      link: link || '#',
      order: Date.now(),
      isActive: isActive === 'true' || isActive === true,
      isExternal: isExternal === 'true' || isExternal === true,
      section: 'navbar',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('navitems').insertOne(navItem);
    res.json({ success: true, message: 'Navbar link created', data: { _id: result.insertedId, ...navItem } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create nav item', error: error.message });
  }
};

// PUT /api/admin/header/nav/:id
exports.updateNavItem = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { labelEn, labelBn, link, isExternal, isActive } = req.body;

    const updateData = {
      label: { en: labelEn || '', bn: labelBn || '' },
      link: link || '#',
      isActive: isActive === 'true' || isActive === true,
      isExternal: isExternal === 'true' || isExternal === true,
      updatedAt: new Date()
    };

    const result = await db.collection('navitems').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Nav item not found' });
    }

    res.json({ success: true, message: 'Navbar link updated', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update nav item', error: error.message });
  }
};

// DELETE /api/admin/header/nav/:id
exports.deleteNavItem = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const result = await db.collection('navitems').deleteOne({ _id: new ObjectId(req.params.id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Nav item not found' });
    }

    res.json({ success: true, message: 'Navbar link deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete nav item', error: error.message });
  }
};

// POST /api/admin/header/nav/reorder
exports.reorderNavItems = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { items } = req.body; // [{_id, order}]

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
      await db.collection('navitems').bulkWrite(bulkOps);
    }

    res.json({ success: true, message: 'Navbar reordered' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reorder nav items', error: error.message });
  }
};

// POST /api/admin/header/logo
exports.updateHeaderLogo = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { logoUrl } = req.body; // Fallback URL if not uploaded

    let finalUrl = logoUrl;
    if (req.file) {
      finalUrl = `/uploads/${req.file.filename}`;
    }

    await db.collection('footersettings').updateOne(
      {},
      { $set: { headerLogoUrl: finalUrl, updatedAt: new Date() } },
      { upsert: true }
    );

    res.json({ success: true, message: 'Header logo updated', data: { headerLogoUrl: finalUrl } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update header logo', error: error.message });
  }
};

// PUT /api/admin/header/text
exports.updateHeaderText = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { logoTextEn, logoTextBn } = req.body;

    await db.collection('footersettings').updateOne(
      {},
      { $set: { logoText: { en: logoTextEn, bn: logoTextBn }, updatedAt: new Date() } },
      { upsert: true }
    );

    res.json({ success: true, message: 'Header text updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update header text', error: error.message });
  }
};

// ==========================================
// FOOTER ADMIN APIs
// ==========================================

// GET /api/admin/footer/settings
exports.getFooterSettings = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    let footer = await db.collection('footersettings').findOne({});

    if (!footer) {
      footer = {
        companyName: { en: '', bn: '' },
        logoUrl: '',
        headerLogoUrl: '',
        logoText: { en: '', bn: '' },
        address: { en: '', bn: '' },
        phone: '',
        whatsapp: '',
        email: '',
        socialLinks: { facebook: '', instagram: '', youtube: '', linkedin: '', twitter: '' },
        quickLinks: [],
        businessHours: {
          mon: { open: '09:00', close: '18:00', closed: false },
          tue: { open: '09:00', close: '18:00', closed: false },
          wed: { open: '09:00', close: '18:00', closed: false },
          thu: { open: '09:00', close: '18:00', closed: false },
          fri: { open: '09:00', close: '18:00', closed: false },
          sat: { open: '09:00', close: '18:00', closed: false },
          sun: { open: '09:00', close: '18:00', closed: true }
        },
        mapsEmbedUrl: '',
        copyright: { en: '', bn: '' }
      };
      await db.collection('footersettings').insertOne(footer);
    }

    res.json({ success: true, data: footer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch footer settings', error: error.message });
  }
};

// PUT /api/admin/footer/settings
exports.updateFooterSettings = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    
    // Parse complex JSON objects from form-data if passed as stringified strings
    let socialLinks = {};
    let businessHours = {};
    
    try { socialLinks = JSON.parse(req.body.socialLinks || '{}'); } catch(e) {}
    try { businessHours = JSON.parse(req.body.businessHours || '{}'); } catch(e) {}

    const updateData = {
      companyName: { en: req.body.companyNameEn || '', bn: req.body.companyNameBn || '' },
      address: { en: req.body.addressEn || '', bn: req.body.addressBn || '' },
      phone: req.body.phone || '',
      whatsapp: req.body.whatsapp || '',
      email: req.body.email || '',
      socialLinks,
      businessHours,
      mapsEmbedUrl: req.body.mapsEmbedUrl || '',
      copyright: { en: req.body.copyrightEn || '', bn: req.body.copyrightBn || '' },
      updatedAt: new Date()
    };

    if (req.file) {
      updateData.logoUrl = `/uploads/${req.file.filename}`;
    } else if (req.body.logoUrl) {
      // Allow passing URL string if not uploading new file
      updateData.logoUrl = req.body.logoUrl;
    }

    const result = await db.collection('footersettings').findOneAndUpdate(
      {},
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );

    res.json({ success: true, message: 'Footer settings updated', data: result || updateData });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update footer settings', error: error.message });
  }
};

// POST /api/admin/footer/quick-links
exports.addQuickLink = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { labelEn, labelBn, link, order } = req.body;

    const newLink = {
      label: { en: labelEn || '', bn: labelBn || '' },
      link: link || '#',
      order: order ? parseInt(order, 10) : Date.now()
    };

    await db.collection('footersettings').updateOne(
      {},
      { $push: { quickLinks: newLink }, $set: { updatedAt: new Date() } }
    );

    res.json({ success: true, message: 'Quick link added', data: newLink });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add quick link', error: error.message });
  }
};

// PUT /api/admin/footer/quick-links/:index
exports.updateQuickLink = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const index = parseInt(req.params.index, 10);
    const { labelEn, labelBn, link } = req.body;

    const footer = await db.collection('footersettings').findOne({});
    if (!footer || !footer.quickLinks || index < 0 || index >= footer.quickLinks.length) {
      return res.status(404).json({ success: false, message: 'Quick link not found' });
    }

    const quickLinks = [...footer.quickLinks];
    quickLinks[index].label = { en: labelEn || '', bn: labelBn || '' };
    quickLinks[index].link = link || '#';

    await db.collection('footersettings').updateOne(
      {},
      { $set: { quickLinks, updatedAt: new Date() } }
    );

    res.json({ success: true, message: 'Quick link updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update quick link', error: error.message });
  }
};

// DELETE /api/admin/footer/quick-links/:index
exports.deleteQuickLink = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const index = parseInt(req.params.index, 10);

    const footer = await db.collection('footersettings').findOne({});
    if (!footer || !footer.quickLinks || index < 0 || index >= footer.quickLinks.length) {
      return res.status(404).json({ success: false, message: 'Quick link not found' });
    }

    const quickLinks = footer.quickLinks.filter((_, i) => i !== index);

    await db.collection('footersettings').updateOne(
      {},
      { $set: { quickLinks, updatedAt: new Date() } }
    );

    res.json({ success: true, message: 'Quick link deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete quick link', error: error.message });
  }
};

// POST /api/admin/footer/quick-links/reorder
exports.reorderQuickLinks = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { items } = req.body; // array of indexes/orders or full array

    if (!Array.isArray(items)) {
      return res.status(400).json({ success: false, message: 'Invalid payload' });
    }

    await db.collection('footersettings').updateOne(
      {},
      { $set: { quickLinks: items, updatedAt: new Date() } }
    );

    res.json({ success: true, message: 'Quick links reordered' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reorder quick links', error: error.message });
  }
};


// ==========================================
// PUBLIC APIs 
// ==========================================

// GET /api/public/navbar
exports.getPublicNavbar = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    // Return BOTH nav items and the header logo/texto
    const [items, settings] = await Promise.all([
      db.collection('navitems').find({ section: 'navbar', isActive: true }).sort({ order: 1 }).toArray(),
      db.collection('footersettings').findOne({}, { projection: { headerLogoUrl: 1, logoText: 1 } })
    ]);
    res.json({ success: true, data: { items: items || [], headerLogoUrl: settings?.headerLogoUrl, logoText: settings?.logoText } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch navbar', error: error.message });
  }
};

// GET /api/public/footer
exports.getPublicFooter = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const footer = await db.collection('footersettings').findOne({});
    res.json({ success: true, data: footer || null });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch footer', error: error.message });
  }
};
