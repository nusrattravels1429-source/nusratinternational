const { protectAdmin } = require('../middleware/auth');

// GET /admin/navigation - List all navigation links
exports.getNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { status = 'all' } = req.query;
    
    let query = {};
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    // Get only top-level links (no parent)
    const navLinks = await db.collection('navlinks').find({ 
      ...query, 
      parent: null 
    }).sort({ order: 1, createdAt: -1 }).toArray();
    
    // Get children for each link
    for (let link of navLinks) {
      const children = await db.collection('navlinks').find({ 
        parent: link._id 
      }).sort({ order: 1 }).toArray();
      link.children = children;
    }
    
    res.render('admin/navigation/list', {
      admin: req.admin,
      navLinks,
      currentStatus: status
    });
  } catch (error) {
    console.error('Get navigation error:', error);
    res.status(500).send('Error loading navigation links');
  }
};

// GET /admin/navigation/create - Show create form
exports.getCreateNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    
    // Get all top-level links for parent selection
    const parents = await db.collection('navlinks').find({ parent: null })
      .sort({ order: 1 })
      .toArray();
    
    res.render('admin/navigation/form', {
      admin: req.admin,
      link: null,
      action: 'create',
      parents
    });
  } catch (error) {
    console.error('Get create navigation error:', error);
    res.status(500).send('Error loading create form');
  }
};

// POST /admin/navigation/create - Create new navigation link
exports.createNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      labelEn, labelBn, url, parentId,
      order, isActive, isOpenInNewTab
    } = req.body;
    
    const navLink = {
      label: { en: labelEn, bn: labelBn || '' },
      url,
      parent: parentId ? require('mongodb').ObjectId(parentId) : null,
      order: order ? parseInt(order) : 0,
      isActive: isActive === 'on',
      isOpenInNewTab: isOpenInNewTab === 'on',
      children: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('navlinks').insertOne(navLink);
    
    // If it's a child link, update parent's children array
    if (parentId) {
      await db.collection('navlinks').updateOne(
        { _id: require('mongodb').ObjectId(parentId) },
        { $push: { children: result.insertedId } }
      );
    }
    
    res.redirect('/admin/navigation');
  } catch (error) {
    console.error('Create navigation error:', error);
    res.status(500).send('Error creating navigation link');
  }
};

// GET /admin/navigation/edit/:id - Show edit form
exports.getEditNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const link = await db.collection('navlinks').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!link) {
      return res.status(404).send('Navigation link not found');
    }
    
    // Get all top-level links for parent selection (excluding current link)
    const parents = await db.collection('navlinks').find({ 
      parent: null, 
      _id: { $ne: new ObjectId(req.params.id) }
    }).sort({ order: 1 }).toArray();
    
    res.render('admin/navigation/form', {
      admin: req.admin,
      link,
      action: 'edit',
      parents
    });
  } catch (error) {
    console.error('Get edit navigation error:', error);
    res.status(500).send('Error loading navigation link');
  }
};

// POST /admin/navigation/update/:id - Update navigation link
exports.updateNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { 
      labelEn, labelBn, url, parentId,
      order, isActive, isOpenInNewTab
    } = req.body;
    
    const newParentId = parentId ? new ObjectId(parentId) : null;
    
    const updateData = {
      label: { en: labelEn, bn: labelBn || '' },
      url,
      parent: newParentId,
      order: order ? parseInt(order) : 0,
      isActive: isActive === 'on',
      isOpenInNewTab: isOpenInNewTab === 'on',
      updatedAt: new Date()
    };
    
    // Get current link to check if parent changed
    const currentLink = await db.collection('navlinks').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    await db.collection('navlinks').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    // Handle parent change
    if (currentLink.parent && (!parentId || currentLink.parent.toString() !== parentId)) {
      // Remove from old parent's children
      await db.collection('navlinks').updateOne(
        { _id: currentLink.parent },
        { $pull: { children: new ObjectId(req.params.id) } }
      );
    }
    
    if (parentId && (!currentLink.parent || currentLink.parent.toString() !== parentId)) {
      // Add to new parent's children
      await db.collection('navlinks').updateOne(
        { _id: newParentId },
        { $push: { children: new ObjectId(req.params.id) } }
      );
    }
    
    res.redirect('/admin/navigation');
  } catch (error) {
    console.error('Update navigation error:', error);
    res.status(500).send('Error updating navigation link');
  }
};

// POST /admin/navigation/delete/:id - Delete navigation link
exports.deleteNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
    const link = await db.collection('navlinks').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!link) {
      return res.status(404).send('Navigation link not found');
    }
    
    // If link has children, either delete them or prevent deletion
    if (link.children && link.children.length > 0) {
      // Delete children first
      await db.collection('navlinks').deleteMany({ 
        _id: { $in: link.children.map(id => new ObjectId(id)) } 
      });
    }
    
    // Remove from parent's children array
    if (link.parent) {
      await db.collection('navlinks').updateOne(
        { _id: link.parent },
        { $pull: { children: new ObjectId(req.params.id) } }
      );
    }
    
    // Delete the link
    await db.collection('navlinks').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
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
      res.status(500).send('Error deleting navigation link');
    }
  }
};

// API: GET /api/navigation - Get all navigation links
exports.apiGetNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { isActive } = req.query;
    
    let query = {};
    if (isActive !== undefined) query.isActive = isActive === 'true';
    
    // Get top-level links
    const navLinks = await db.collection('navlinks').find({ 
      ...query, 
      parent: null 
    }).sort({ order: 1 }).toArray();
    
    // Get children for each link
    for (let link of navLinks) {
      const children = await db.collection('navlinks').find({ 
        parent: link._id 
      }).sort({ order: 1 }).toArray();
      link.children = children;
    }
    
    res.json({ success: true, navLinks });
  } catch (error) {
    console.error('API get navigation error:', error);
    res.status(500).json({ success: false, error: 'Error loading navigation' });
  }
};

// API: POST /api/navigation - Create navigation link
exports.apiCreateNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { label, url, parent, order, isActive, isOpenInNewTab } = req.body;
    
    const navLink = {
      label: { en: label?.en || '', bn: label?.bn || '' },
      url,
      parent: parent ? require('mongodb').ObjectId(parent) : null,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true,
      isOpenInNewTab: isOpenInNewTab || false,
      children: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('navlinks').insertOne(navLink);
    
    if (parent) {
      await db.collection('navlinks').updateOne(
        { _id: require('mongodb').ObjectId(parent) },
        { $push: { children: result.insertedId } }
      );
    }
    
    const created = await db.collection('navlinks').findOne({ 
      _id: result.insertedId 
    });
    
    res.json({ success: true, link: created });
  } catch (error) {
    console.error('API create navigation error:', error);
    res.status(500).json({ success: false, error: 'Error creating navigation link' });
  }
};

// API: PUT /api/navigation/:id - Update navigation link
exports.apiUpdateNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { label, url, parent, order, isActive, isOpenInNewTab } = req.body;
    
    const updateData = {
      updatedAt: new Date()
    };
    
    if (label) updateData.label = label;
    if (url) updateData.url = url;
    if (parent !== undefined) updateData.parent = parent ? new ObjectId(parent) : null;
    if (order !== undefined) updateData.order = order;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (isOpenInNewTab !== undefined) updateData.isOpenInNewTab = isOpenInNewTab;
    
    await db.collection('navlinks').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    const updated = await db.collection('navlinks').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    res.json({ success: true, link: updated });
  } catch (error) {
    console.error('API update navigation error:', error);
    res.status(500).json({ success: false, error: 'Error updating navigation link' });
  }
};

// API: DELETE /api/navigation/:id - Delete navigation link
exports.apiDeleteNavigation = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
    const link = await db.collection('navlinks').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (link?.children?.length > 0) {
      await db.collection('navlinks').deleteMany({ 
        _id: { $in: link.children.map(id => new ObjectId(id)) } 
      });
    }
    
    if (link?.parent) {
      await db.collection('navlinks').updateOne(
        { _id: link.parent },
        { $pull: { children: new ObjectId(req.params.id) } }
      );
    }
    
    await db.collection('navlinks').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('API delete navigation error:', error);
    res.status(500).json({ success: false, error: 'Error deleting navigation link' });
  }
};

// Aliases for admin routes
exports.manageNavigation = exports.getNavigation;
exports.createLink = exports.createNavigation;
exports.updateLink = exports.updateNavigation;
exports.deleteLink = exports.deleteNavigation;
