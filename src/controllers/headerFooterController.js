const { ObjectId } = require('mongodb');

// Helper to ensure we only ever modify ONE specific footer settings document
async function getFooterId(db) {
  const f = await db.collection('footersettings').findOne({}, { sort: { _id: 1 } });
  if (f) return f._id;
  const res = await db.collection('footersettings').insertOne({
    companyName: { en: '', bn: '' },
    logoUrl: '', headerLogoUrl: '',
    logoText: { en: '', bn: '' },
    address: { en: '', bn: '' }, phone: '', whatsapp: '', email: '', socialLinks: {}, mapsEmbedUrl: '', businessHours: {}, copyright: { en: '', bn: '' }, quickLinks: []
  });
  return res.insertedId;
}

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
    console.log('--- POST /api/admin/header/nav ---');
    console.log('req.body:', req.body);
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
    console.log('--- PUT /api/admin/header/nav/' + req.params.id + ' ---');
    console.log('req.body:', req.body);
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
      finalUrl = req.file.path || `/uploads/${req.file.filename}`;
    }

    const fid = await getFooterId(db);
    await db.collection('footersettings').updateOne(
      { _id: fid },
      { $set: { headerLogoUrl: finalUrl, updatedAt: new Date() } }
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

    const fid = await getFooterId(db);
    await db.collection('footersettings').updateOne(
      { _id: fid },
      { $set: { logoText: { en: logoTextEn, bn: logoTextBn }, updatedAt: new Date() } }
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
    const fid = await getFooterId(db);
    let footer = await db.collection('footersettings').findOne({ _id: fid });

    res.json({ success: true, data: footer });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch footer settings', error: error.message });
  }
};

// PUT /api/admin/footer/settings
exports.updateFooterSettings = async (req, res) => {
  try {
    console.log('--- PUT /api/admin/footer/settings ---');
    console.log('req.body:', req.body);
    console.log('req.file:', req.file);
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
      updateData.logoUrl = req.file.path || `/uploads/${req.file.filename}`;
    } else if (req.body.logoUrl) {
      // Allow passing URL string if not uploading new file
      updateData.logoUrl = req.body.logoUrl;
    }

    const fid = await getFooterId(db);
    const result = await db.collection('footersettings').findOneAndUpdate(
      { _id: fid },
      { $set: updateData },
      { returnDocument: 'after' }
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
    const newLink = req.body; // { labelEn, labelBn, link }
    
    // Ensure properly formatted
    const qk = {
      label: { en: newLink.labelEn, bn: newLink.labelBn },
      link: newLink.link
    };

    const fid = await getFooterId(db);
    await db.collection('footersettings').updateOne(
      { _id: fid },
      { $push: { quickLinks: qk }, $set: { updatedAt: new Date() } }
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
    const index = parseInt(req.params.index);
    const { labelEn, labelBn, link } = req.body;
    
    const fid = await getFooterId(db);

    await db.collection('footersettings').updateOne(
      { _id: fid },
      { $set: {
        [`quickLinks.${index}.label.en`]: labelEn,
        [`quickLinks.${index}.label.bn`]: labelBn,
        [`quickLinks.${index}.link`]: link,
        updatedAt: new Date()
      }}
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
    const index = parseInt(req.params.index);

    const fid = await getFooterId(db);
    const footer = await db.collection('footersettings').findOne({ _id: fid });
    if (footer && footer.quickLinks) {
      footer.quickLinks.splice(index, 1);
      await db.collection('footersettings').updateOne(
        { _id: fid },
        { $set: { quickLinks: footer.quickLinks, updatedAt: new Date() } }
      );
    }

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

    const fid = await getFooterId(db);
    await db.collection('footersettings').updateOne(
      { _id: fid },
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
    const fid = await getFooterId(db);
    // Return BOTH nav items and the header logo/texto
    const [items, settings] = await Promise.all([
      db.collection('navitems').find({ section: 'navbar', isActive: true }).sort({ order: 1 }).toArray(),
      db.collection('footersettings').findOne({ _id: fid }, { projection: { headerLogoUrl: 1, logoText: 1 } })
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
    const fid = await getFooterId(db);
    const footer = await db.collection('footersettings').findOne({ _id: fid });
    res.json({ success: true, data: footer || {} });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch footer', error: error.message });
  }
};
