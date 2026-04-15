const { protectAdmin } = require('../middleware/auth');

// GET /admin/gallery - List all gallery items
exports.getGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    
    const galleryItems = await db.collection('galleryitems').find({})
      .sort({ createdAt: -1 })
      .toArray();
    
    res.render('admin/gallery/manage', {
      admin: req.admin,
      items: galleryItems
    });
  } catch (error) {
    console.error('Get gallery error:', error);
    res.status(500).send('Error loading gallery');
  }
};

// POST /admin/gallery/create - Create new gallery item
exports.createGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { titleEn, titleBn } = req.body;
    
    let imageUrl = '';
    if (req.file) {
      imageUrl = '/uploads/' + req.file.filename;
    }
    
    const galleryItem = {
      title: { en: titleEn, bn: titleBn || '' },
      imageUrl,
      isActive: true,
      createdAt: new Date()
    };
    
    const result = await db.collection('galleryitems').insertOne(galleryItem);
    
    res.redirect('/admin/gallery');
  } catch (error) {
    console.error('Create gallery error:', error);
    res.status(500).send('Error creating gallery item');
  }
};

// POST /admin/gallery/update/:id - Update gallery item
exports.updateGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { titleEn, titleBn } = req.body;
    
    const updateData = {
      title: { en: titleEn, bn: titleBn || '' }
    };
    
    if (req.file) {
      updateData.imageUrl = '/uploads/' + req.file.filename;
    }
    
    await db.collection('galleryitems').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    res.redirect('/admin/gallery');
  } catch (error) {
    console.error('Update gallery error:', error);
    res.status(500).send('Error updating gallery item');
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
      res.status(500).send('Error deleting gallery item');
    }
  }
};

// API: GET /api/gallery - Get all gallery items
exports.apiGetGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { key } = req.query;
    
    let query = {};
    if (key) {
      const { ObjectId } = require('mongodb');
      query._id = new ObjectId(key);
    }
    
    const galleryItems = await db.collection('galleryitems').find(query)
      .sort({ createdAt: -1 })
      .toArray();
    
    res.json({ success: true, items: galleryItems });
  } catch (error) {
    console.error('API get gallery error:', error);
    res.status(500).json({ success: false, error: 'Error loading gallery' });
  }
};

// API: POST /api/gallery - Create gallery item
exports.apiCreateGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { title, imageUrl } = req.body;
    
    const galleryItem = {
      title: { en: title?.en || '', bn: title?.bn || '' },
      imageUrl: imageUrl || '',
      isActive: true,
      createdAt: new Date()
    };
    
    const result = await db.collection('galleryitems').insertOne(galleryItem);
    
    res.json({ success: true, item: result.ops[0] });
  } catch (error) {
    console.error('API create gallery error:', error);
    res.status(500).json({ success: false, error: 'Error creating gallery item' });
  }
};

// API: PUT /api/gallery/:id - Update gallery item
exports.apiUpdateGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { title, imageUrl, isActive } = req.body;
    
    const updateData = {};
    
    if (title) updateData.title = title;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;
    if (isActive !== undefined) updateData.isActive = isActive;
    
    await db.collection('galleryitems').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    const updated = await db.collection('galleryitems').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    res.json({ success: true, item: updated });
  } catch (error) {
    console.error('API update gallery error:', error);
    res.status(500).json({ success: false, error: 'Error updating gallery item' });
  }
};

// API: DELETE /api/gallery/:id - Delete gallery item
exports.apiDeleteGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
    await db.collection('galleryitems').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('API delete gallery error:', error);
    res.status(500).json({ success: false, error: 'Error deleting gallery item' });
  }
};

// Aliases for admin routes
exports.manageGallery = exports.getGallery;
exports.createGalleryItem = exports.createGallery;
exports.updateGalleryItem = exports.updateGallery;
exports.deleteGalleryItem = exports.deleteGallery;
