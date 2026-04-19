const { ObjectId } = require('mongodb');

// ==========================================
// VIEWS (Admin)
// ==========================================
exports.manageGallery = async (req, res) => {
  res.render('admin/gallery/manage', { 
    admin: req.admin || req.session?.admin || { username: 'Admin' }, 
    activePage: 'gallery' 
  });
};

// ==========================================
// ADMIN API ROUTES
// ==========================================

// GET /api/admin/gallery
exports.getAdminGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const items = await db.collection('galleryitems')
      .find({})
      .sort({ order: 1, createdAt: -1 })
      .toArray();
    res.json({ success: true, data: items || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch gallery', error: error.message });
  }
};

// POST /api/admin/gallery
exports.createGalleryItem = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { titleEn, titleBn, captionEn, captionBn, category, isActive } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const imageUrl = `/uploads/gallery/${req.file.filename}`;

    const galleryItem = {
      title: { en: titleEn || '', bn: titleBn || '' },
      caption: { en: captionEn || '', bn: captionBn || '' },
      imageUrl,
      category: category || 'general',
      order: Date.now(), // default high order
      isActive: isActive === 'true' || isActive === true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('galleryitems').insertOne(galleryItem);
    res.json({ success: true, message: 'Image uploaded successfully', data: { _id: result.insertedId, ...galleryItem } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create item', error: error.message });
  }
};

// PUT /api/admin/gallery/:id
exports.updateGalleryItem = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { titleEn, titleBn, captionEn, captionBn, category, isActive } = req.body;

    const updateData = {
      title: { en: titleEn || '', bn: titleBn || '' },
      caption: { en: captionEn || '', bn: captionBn || '' },
      category: category || 'general',
      isActive: isActive === 'true' || isActive === true,
      updatedAt: new Date()
    };

    if (req.file) {
      updateData.imageUrl = `/uploads/gallery/${req.file.filename}`;
    }

    const result = await db.collection('galleryitems').findOneAndUpdate(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, message: 'Item updated successfully', data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update item', error: error.message });
  }
};

// DELETE /api/admin/gallery/:id
exports.deleteGalleryItem = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    
    // Hard delete for simplicity as requested "Soft ... or hard delete"
    const result = await db.collection('galleryitems').deleteOne({ _id: new ObjectId(req.params.id) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Item not found' });
    }

    res.json({ success: true, message: 'Item deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete item', error: error.message });
  }
};

// POST /api/admin/gallery/reorder
exports.reorderGalleryItems = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { items } = req.body; // Array of { _id, order }

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
      await db.collection('galleryitems').bulkWrite(bulkOps);
    }

    res.json({ success: true, message: 'Items reordered successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to reorder items', error: error.message });
  }
};

// ==========================================
// PUBLIC API ROUTES
// ==========================================

// GET /api/public/gallery
exports.getPublicGallery = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { category, limit = 50 } = req.query;

    const query = { isActive: true };
    if (category && category !== 'all') {
      query.category = category;
    }

    const items = await db.collection('galleryitems')
      .find(query)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit, 10))
      .toArray();

    res.json({ success: true, data: items || [] });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch public gallery', error: error.message });
  }
};
