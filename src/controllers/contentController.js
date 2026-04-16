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

// POST /admin/content/update-slides - Special handler for homepage slider
exports.updateSlides = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    // Parse slides from form (multiple slides)
    const slides = [];
    const titles_en = [].concat(req.body.slideTitle_en || []);
    const titles_bn = [].concat(req.body.slideTitle_bn || []);
    const subtitles_en = [].concat(req.body.slideSubtitle_en || []);
    const subtitles_bn = [].concat(req.body.slideSubtitle_bn || []);
    const cta_texts = [].concat(req.body.slideCta || []);
    const cta_links = [].concat(req.body.slideCtaLink || []);
    const existingImages = [].concat(req.body.slideExistingImage || []);

    // Handle uploaded files (indexed by fieldname like 'slideImage_0')
    const uploadedImages = {};
    if (req.files) {
      Object.entries(req.files).forEach(([fieldName, files]) => {
        const match = fieldName.match(/slideImage_(\d+)/);
        if (match && files[0]) {
          const f = files[0];
          uploadedImages[parseInt(match[1])] = f.path || ('/uploads/' + f.filename);
        }
      });
    }

    const maxSlides = 4;
    for (let i = 0; i < Math.min(titles_en.length, maxSlides); i++) {
      if (titles_en[i]) {
        slides.push({
          title: { en: titles_en[i] || '', bn: titles_bn[i] || '' },
          subtitle: { en: subtitles_en[i] || '', bn: subtitles_bn[i] || '' },
          cta_text: cta_texts[i] || '',
          cta_link: cta_links[i] || '/',
          image_url: uploadedImages[i] || existingImages[i] || '',
          order: i,
          isActive: true
        });
      }
    }

    await db.collection('sitecontents').updateOne(
      { section: 'homepage', key: 'hero-slider' },
      { $set: { section: 'homepage', key: 'hero-slider', slides, updatedAt: new Date() } },
      { upsert: true }
    );

    res.redirect('/admin/content/manage/homepage');
  } catch (error) {
    console.error('Update slides error:', error);
    res.status(500).send('Error updating slides: ' + error.message);
  }
};

// POST /admin/content/delete/:id - Delete a content document
exports.deleteContent = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    const doc = await db.collection('sitecontents').findOne({ _id: new ObjectId(req.params.id) });
    const section = doc?.section || 'homepage';

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
