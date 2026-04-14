const { protectAdmin } = require('../middleware/auth');

// GET /admin/content/:section - Get content for a section
exports.getContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { section } = req.params;
    
    const validSections = ['homepage', 'ticketing', 'travel', 'hajj', 'work', 'contact', 'about', 'gallery', 'certifications', 'team'];
    
    if (!validSections.includes(section)) {
      return res.status(400).json({ success: false, error: 'Invalid section' });
    }
    
    const content = await db.collection('sitecontents').find({ 
      section, 
      isActive: true 
    }).sort({ 'metadata.order': 1, createdAt: -1 }).toArray();
    
    res.json({ success: true, content });
  } catch (error) {
    console.error('Get content error:', error);
    res.status(500).json({ success: false, error: 'Error loading content' });
  }
};

// GET /admin/content/manage/:section - Show manage page for a section
exports.getManageContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { section } = req.params;
    
    const validSections = ['homepage', 'ticketing', 'about'];
    
    if (!validSections.includes(section)) {
      return res.status(400).send('Invalid section');
    }
    
    const content = await db.collection('sitecontents').find({ 
      section 
    }).sort({ 'metadata.order': 1, createdAt: -1 }).toArray();
    
    res.render('admin/content/manage', {
      admin: req.admin,
      section,
      content
    });
  } catch (error) {
    console.error('Get manage content error:', error);
    res.status(500).send('Error loading content management');
  }
};

// POST /admin/content/create - Create new content
exports.createContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      key, section, titleEn, titleBn, contentEn, contentBn, isActive 
    } = req.body;
    
    // Handle image uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      req.files.forEach((file, index) => {
        images.push({
          url: '/uploads/' + file.filename,
          caption: { en: '', bn: '' },
          order: index
        });
      });
    }
    
    const contentDoc = {
      key: key || `${section}-${Date.now()}`,
      section,
      title: { en: titleEn || '', bn: titleBn || '' },
      content: { en: contentEn || '', bn: contentBn || '' },
      images,
      metadata: { order: 0 },
      isActive: isActive === 'on',
      updatedAt: new Date(),
      createdAt: new Date()
    };
    
    const result = await db.collection('sitecontents').insertOne(contentDoc);
    
    res.redirect('/admin/content/manage/' + section);
  } catch (error) {
    console.error('Create content error:', error);
    res.status(500).send('Error creating content');
  }
};

// POST /admin/content/update/:id - Update content
exports.updateContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { 
      key, section, titleEn, titleBn, contentEn, contentBn, 
      isActive, existingImages 
    } = req.body;
    
    // Handle existing images
    let images = [];
    if (existingImages) {
      try {
        images = JSON.parse(existingImages);
      } catch (e) {
        images = [];
      }
    }
    
    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      const startOrder = images.length;
      req.files.forEach((file, index) => {
        images.push({
          url: '/uploads/' + file.filename,
          caption: { en: '', bn: '' },
          order: startOrder + index
        });
      });
    }
    
    const updateData = {
      key: key || req.body.key,
      section,
      title: { en: titleEn || '', bn: titleBn || '' },
      content: { en: contentEn || '', bn: contentBn || '' },
      images,
      isActive: isActive === 'on',
      updatedAt: new Date()
    };
    
    await db.collection('sitecontents').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    res.redirect('/admin/content/manage/' + section);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).send('Error updating content');
  }
};

// POST /admin/content/delete/:id - Delete content
exports.deleteContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
    await db.collection('sitecontents').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect('/admin/content/manage/' + req.body.section);
    }
  } catch (error) {
    console.error('Delete content error:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ success: false, error: 'Error deleting content' });
    } else {
      res.status(500).send('Error deleting content');
    }
  }
};

// PUT /api/content/:section - API endpoint to update section content
exports.apiUpdateContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { section } = req.params;
    const { key, title, content, images, metadata } = req.body;
    
    const updateData = {
      updatedAt: new Date()
    };
    
    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (images) updateData.images = images;
    if (metadata) updateData.metadata = metadata;
    
    const result = await db.collection('sitecontents').findOneAndUpdate(
      { key: key || `default-${section}`, section },
      { $set: updateData },
      { upsert: true, returnDocument: 'after' }
    );
    
    res.json({ success: true, content: result.value || result });
  } catch (error) {
    console.error('API update content error:', error);
    res.status(500).json({ success: false, error: 'Error updating content' });
  }
};

// GET /api/content/:section - API endpoint to get section content
exports.apiGetContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { section } = req.params;
    const { key } = req.query;
    
    let query = { section, isActive: true };
    if (key) {
      query.key = key;
    }
    
    const content = await db.collection('sitecontents').find(query)
      .sort({ 'metadata.order': 1, createdAt: -1 })
      .toArray();
    
    res.json({ success: true, content });
  } catch (error) {
    console.error('API get content error:', error);
    res.status(500).json({ success: false, error: 'Error loading content' });
  }
};
