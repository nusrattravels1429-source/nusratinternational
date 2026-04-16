// GET /admin/gallery - List all gallery items
exports.getGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { category = 'all' } = req.query;

    let query = {};
    if (category !== 'all') query.category = category;

    const galleryItems = await db.collection('galleryitems').find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    res.render('admin/gallery/manage', {
      admin: req.admin,
      items: galleryItems,
      currentCategory: category
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).send('Error loading gallery: ' + error.message);
  }
};

// POST /admin/gallery/create - Create new gallery item
exports.createGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { titleEn, titleBn, category, isActive } = req.body;

    let imageUrl = '';
    if (req.file) {
      imageUrl = req.file.path || ('/uploads/' + req.file.filename);
    }

    const galleryItem = {
      title: { en: titleEn || '', bn: titleBn || '' },
      imageUrl,
      category: category || 'general',
      isActive: isActive !== 'false',
      order: 0,
      createdAt: new Date()
    };

    await db.collection('galleryitems').insertOne(galleryItem);
    res.redirect('/admin/gallery');
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).send('Error creating gallery item: ' + error.message);
  }
};

// POST /admin/gallery/update/:id - Update gallery item
exports.updateGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { titleEn, titleBn, category, isActive } = req.body;

    const updateData = {
      title: { en: titleEn || '', bn: titleBn || '' },
      category: category || 'general',
      isActive: isActive !== 'false',
      updatedAt: new Date()
    };

    if (req.file) {
      updateData.imageUrl = req.file.path || ('/uploads/' + req.file.filename);
    }

    await db.collection('galleryitems').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    res.redirect('/admin/gallery');
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).send('Error updating gallery item: ' + error.message);
  }
};

// POST /admin/gallery/delete/:id - Delete gallery item
exports.deleteGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');

    await db.collection('galleryitems').deleteOne({
      _id: new ObjectId(req.params.id)
    });

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect('/admin/gallery');
    }
  } catch (error) {
    console.error('Delete gallery error:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ success: false, error: 'Error deleting gallery item' });
    } else {
      res.status(500).send('Error deleting gallery item: ' + error.message);
    }
  }
};

// API: GET /api/gallery - Get all gallery items
exports.apiGetGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { key, category, isActive } = req.query;

    let query = {};
    if (key) {
      const { ObjectId } = require('mongodb');
      query._id = new ObjectId(key);
    }
    if (category) query.category = category;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const galleryItems = await db.collection('galleryitems').find(query)
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    res.json({ success: true, items: galleryItems });
  } catch (error) {
    console.error('API get gallery error:', error);
    res.status(500).json({ success: false, error: 'Error loading gallery' });
  }
};

// Aliases for admin routes
exports.manageGallery = exports.getGallery;
exports.createGalleryItem = exports.createGallery;
exports.updateGalleryItem = exports.updateGallery;
exports.deleteGalleryItem = exports.deleteGallery;
