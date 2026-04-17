const { ObjectId } = require('mongodb');

// GET /admin/content/manage/:section - Render the manage page for a section
exports.manageContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { section } = req.params;

    const validSections = ['homepage', 'ticketing', 'about', 'travel', 'hajj', 'work', 'contact'];

    if (!validSections.includes(section)) {
      return res.status(404).send('Section not found');
    }

    // Fetch existing content for this section
    const contentDocs = await db.collection('sitecontents').find({ section }).toArray();

    // Build a keyed map for easy template access
    const content = {};
    contentDocs.forEach(doc => { content[doc.key] = doc; });

    res.render('admin/content/manage', {
      admin: req.admin,
      section,
      content,
      contentDocs
    });
  } catch (error) {
    console.error('Manage content error:', error);
    res.status(500).send('Error loading content: ' + error.message);
  }
};

// POST /admin/content/update - Update content (upsert by section+key)
exports.updateContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { section, key, ...fields } = req.body;

    if (!section || !key) {
      return res.status(400).send('Section and key are required');
    }

    // Build update document from submitted fields
    const updateDoc = { section, key, updatedAt: new Date() };

    // Map flat form fields into nested objects
    Object.entries(fields).forEach(([k, v]) => {
      updateDoc[k] = v;
    });

    // Handle file uploads if present
    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, files]) => {
        if (files && files[0]) {
          const f = files[0];
          updateDoc[fieldName] = f.path || ('/uploads/' + f.filename);
        }
      });
    }
    if (req.file) {
      updateDoc.imageUrl = req.file.path || ('/uploads/' + req.file.filename);
    }

    // Upsert: update existing or create new
    await db.collection('sitecontents').updateOne(
      { section, key },
      { $set: updateDoc },
      { upsert: true }
    );

    res.redirect('/admin/content/manage/' + section);
  } catch (error) {
    console.error('Update content error:', error);
    res.status(500).send('Error updating content: ' + error.message);
  }
};

// POST /admin/content/hero-slide/create
exports.createHeroSlide = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { titleEn, titleBn, subtitleEn, subtitleBn, ctaText, ctaLink, order } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path || ('/uploads/' + req.file.filename);
    }

    const doc = {
      section: 'homepage',
      key: 'hero-' + Date.now(),
      title: { en: titleEn || '', bn: titleBn || '' },
      subtitle: { en: subtitleEn || '', bn: subtitleBn || '' },
      cta_text: ctaText || '',
      cta_link: ctaLink || '/',
      images: [{ url: imageUrl }],
      metadata: { order: order ? parseInt(order) : 0 },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await db.collection('sitecontents').insertOne(doc);
    res.redirect('/admin/content/manage/homepage');
  } catch (error) {
    console.error('Create hero slide error:', error);
    res.status(500).send('Error creating slide: ' + error.message);
  }
};

// POST /admin/content/hero-slide/update/:id
exports.updateHeroSlide = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { titleEn, titleBn, subtitleEn, subtitleBn, ctaText, ctaLink, order, existingImage } = req.body;

    let imageUrl = existingImage || '';
    if (req.file) {
      imageUrl = req.file.path || ('/uploads/' + req.file.filename);
    }

    const updateDoc = {
      title: { en: titleEn || '', bn: titleBn || '' },
      subtitle: { en: subtitleEn || '', bn: subtitleBn || '' },
      cta_text: ctaText || '',
      cta_link: ctaLink || '/',
      images: [{ url: imageUrl }],
      metadata: { order: order ? parseInt(order) : 0 },
      updatedAt: new Date()
    };

    await db.collection('sitecontents').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateDoc }
    );

    res.redirect('/admin/content/manage/homepage');
  } catch (error) {
    console.error('Update hero slide error:', error);
    res.status(500).send('Error updating slide: ' + error.message);
  }
};

// POST /admin/content/hero-slide/reorder
exports.reorderHeroSlides = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { orders } = req.body; // array of { id, order }

    if (Array.isArray(orders)) {
      for (const item of orders) {
        if (item.id) {
          await db.collection('sitecontents').updateOne(
            { _id: new ObjectId(item.id) },
            { $set: { 'metadata.order': parseInt(item.order) } }
          );
        }
      }
    }
    res.json({ success: true });
  } catch (error) {
    console.error('Reorder hero slides error:', error);
    res.status(500).json({ success: false, error: 'Error reordering slides' });
  }
};

// POST /admin/content/delete/:id - Delete a content document
exports.deleteContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    const doc = await db.collection('sitecontents').findOne({ _id: new ObjectId(req.params.id) });
    const section = doc?.section || 'homepage';
    const key = doc?.key || '';

    // Enforce Hero Slider minimum layout
    if (section === 'homepage' && key.startsWith('hero-')) {
      const count = await db.collection('sitecontents').countDocuments({
        section: 'homepage',
        key: { $regex: '^hero-' }
      });
      if (count <= 1) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.status(400).json({ error: 'At least 1 hero slide is required' });
        } else {
          return res.status(400).send('At least 1 hero slide is required');
        }
      }
    }

    await db.collection('sitecontents').deleteOne({ _id: new ObjectId(req.params.id) });

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect('/admin/content/manage/' + section);
    }
  } catch (error) {
    console.error('Delete content error:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ success: false, error: 'Error deleting content' });
    } else {
      res.status(500).send('Error deleting content: ' + error.message);
    }
  }
};

// API: GET /api/content/:section - Get content for a section
exports.apiGetContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { section } = req.params;

    const content = await db.collection('sitecontents').find({ section }).toArray();

    // Return as keyed map
    const result = {};
    content.forEach(doc => { result[doc.key] = doc; });

    res.json({ success: true, content: result, raw: content });
  } catch (error) {
    console.error('API get content error:', error);
    res.status(500).json({ success: false, error: 'Error loading content' });
  }
};
