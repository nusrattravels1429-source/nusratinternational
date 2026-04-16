const { ObjectId } = require('mongodb');

// GET /admin/navigation - List all navigation links
exports.getNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    // Get top-level links
    const navLinks = await db.collection('navlinks').find({ parent: null })
      .sort({ order: 1, createdAt: -1 }).toArray();

    // Attach children
    for (let link of navLinks) {
      link.children = await db.collection('navlinks').find({ parent: link._id })
        .sort({ order: 1 }).toArray();
    }

    // Get all links for parent dropdown
    const allLinks = await db.collection('navlinks').find({ parent: null })
      .sort({ order: 1 }).toArray();

    res.render('admin/navigation/manage', {
      admin: req.admin,
      navLinks,
      allLinks
    });
  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).send('Error loading navigation: ' + error.message);
  }
};

// POST /admin/navigation/create - Create new navigation link
exports.createNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { labelEn, labelBn, url, parentId, order, isActive, isOpenInNewTab } = req.body;

    const navLink = {
      label: { en: labelEn || '', bn: labelBn || '' },
      url: url || '#',
      parent: parentId ? new ObjectId(parentId) : null,
      order: order ? parseInt(order) : 0,
      isActive: isActive === 'on',
      isOpenInNewTab: isOpenInNewTab === 'on',
      children: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('navlinks').insertOne(navLink);

    // Update parent's children array
    if (parentId) {
      await db.collection('navlinks').updateOne(
        { _id: new ObjectId(parentId) },
        { $push: { children: result.insertedId } }
      );
    }

    res.redirect('/admin/navigation');
  } catch (error) {
    console.error('Create navigation error:', error);
    res.status(500).send('Error creating navigation link: ' + error.message);
  }
};

// POST /admin/navigation/update/:id - Update navigation link
exports.updateNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { labelEn, labelBn, url, parentId, order, isActive, isOpenInNewTab } = req.body;

    const newParentId = parentId ? new ObjectId(parentId) : null;

    // Get current link to handle parent changes
    const currentLink = await db.collection('navlinks').findOne({ _id: new ObjectId(req.params.id) });

    const updateData = {
      label: { en: labelEn || '', bn: labelBn || '' },
      url: url || '#',
      parent: newParentId,
      order: order ? parseInt(order) : 0,
      isActive: isActive === 'on',
      isOpenInNewTab: isOpenInNewTab === 'on',
      updatedAt: new Date()
    };

    await db.collection('navlinks').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    // Handle parent change - remove from old parent
    if (currentLink?.parent && (!parentId || currentLink.parent.toString() !== parentId)) {
      await db.collection('navlinks').updateOne(
        { _id: currentLink.parent },
        { $pull: { children: new ObjectId(req.params.id) } }
      );
    }

    // Add to new parent
    if (parentId && (!currentLink?.parent || currentLink.parent.toString() !== parentId)) {
      await db.collection('navlinks').updateOne(
        { _id: newParentId },
        { $push: { children: new ObjectId(req.params.id) } }
      );
    }

    res.redirect('/admin/navigation');
  } catch (error) {
    console.error('Update navigation error:', error);
    res.status(500).send('Error updating navigation link: ' + error.message);
  }
};

// POST /admin/navigation/delete/:id - Delete navigation link
exports.deleteNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    const link = await db.collection('navlinks').findOne({ _id: new ObjectId(req.params.id) });

    if (!link) {
      return res.status(404).json({ success: false, error: 'Link not found' });
    }

    // Delete children first
    if (link.children && link.children.length > 0) {
      await db.collection('navlinks').deleteMany({
        _id: { $in: link.children.map(id => new ObjectId(id.toString())) }
      });
    }

    // Remove from parent's children array
    if (link.parent) {
      await db.collection('navlinks').updateOne(
        { _id: link.parent },
        { $pull: { children: new ObjectId(req.params.id) } }
      );
    }

    await db.collection('navlinks').deleteOne({ _id: new ObjectId(req.params.id) });

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect('/admin/navigation');
    }
  } catch (error) {
    console.error('Delete navigation error:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ success: false, error: 'Error deleting navigation link' });
    } else {
      res.status(500).send('Error deleting navigation link: ' + error.message);
    }
  }
};

// API: GET /api/navigation
exports.apiGetNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { isActive } = req.query;

    let query = { parent: null };
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const navLinks = await db.collection('navlinks').find(query)
      .sort({ order: 1 }).toArray();

    for (let link of navLinks) {
      link.children = await db.collection('navlinks').find({ parent: link._id })
        .sort({ order: 1 }).toArray();
    }

    res.json({ success: true, navLinks });
  } catch (error) {
    console.error('API get navigation error:', error);
    res.status(500).json({ success: false, error: 'Error loading navigation' });
  }
};

// Aliases for admin routes
exports.manageNavigation = exports.getNavigation;
exports.createLink = exports.createNavigation;
exports.updateLink = exports.updateNavigation;
exports.deleteLink = exports.deleteNavigation;
