const { protectAdmin } = require('../middleware/auth');

// GET /admin/cards - List all cards
exports.getCards = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { type = 'all', status = 'all' } = req.query;
    
    let query = {};
    
    if (type !== 'all') {
      query.type = type;
    }
    
    if (status === 'active') {
      query.isActive = true;
      query.isPaused = { $ne: true };
    } else if (status === 'paused') {
      query.isPaused = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    const cards = await db.collection('cards').find(query).sort({ order: 1, createdAt: -1 }).toArray();
    
    res.render('admin/cards/list', {
      admin: req.admin,
      cards,
      currentType: type,
      currentStatus: status
    });
  } catch (error) {
    console.error('Get cards error:', error);
    res.status(500).send('Error loading cards');
  }
};

// GET /admin/cards/create - Show create form
exports.getCreateCard = (req, res) => {
  res.render('admin/cards/form', {
    admin: req.admin,
    card: null,
    action: 'create'
  });
};

// POST /admin/cards/create - Create new card
exports.createCard = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      type, titleEn, titleBn, descriptionEn, descriptionBn,
      locationEn, locationBn, priceAmount, priceCurrency,
      duration, featuresEn, featuresBn, isActive
    } = req.body;
    
    // Handle image uploads
    const images = [];
    if (req.files && req.files.length > 0) {
      if (req.files.length > 4) {
        return res.status(400).send('Maximum 4 images allowed per card');
      }
      req.files.forEach((file, index) => {
        images.push({
          url: file.path || '/uploads/' + file.filename,
          caption: '',
          order: index
        });
      });
    }
    
    const card = {
      type,
      title: { en: titleEn, bn: titleBn },
      description: { en: descriptionEn, bn: descriptionBn },
      location: { en: locationEn, bn: locationBn },
      pricing: {
        amount: priceAmount ? parseFloat(priceAmount) : 0,
        currency: priceCurrency || 'BDT',
        displayText: { en: '', bn: '' }
      },
      duration: duration || '',
      features: [],
      images,
      isActive: isActive === 'on',
      isPaused: false,
      order: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    // Parse features if provided
    if (featuresEn) {
      const featuresEnArr = featuresEn.split('\n').filter(f => f.trim());
      const featuresBnArr = featuresBn ? featuresBn.split('\n').filter(f => f.trim()) : [];
      card.features = featuresEnArr.map((f, i) => ({
        en: f,
        bn: featuresBnArr[i] || ''
      }));
    }
    
    // Generate slug
    const slugify = require('slugify');
    card.slug = slugify(titleEn, { lower: true, strict: true }) + '-' + Date.now();
    
    const result = await db.collection('cards').insertOne(card);
    
    res.redirect('/admin/cards');
  } catch (error) {
    console.error('Create card error:', error);
    res.status(500).send('Error creating card');
  }
};

// GET /admin/cards/edit/:id - Show edit form
exports.getEditCard = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const card = await db.collection('cards').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!card) {
      return res.status(404).send('Card not found');
    }
    
    res.render('admin/cards/form', {
      admin: req.admin,
      card,
      action: 'edit'
    });
  } catch (error) {
    console.error('Get edit card error:', error);
    res.status(500).send('Error loading card');
  }
};

// POST /admin/cards/update/:id - Update card
exports.updateCard = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { 
      type, titleEn, titleBn, descriptionEn, descriptionBn,
      locationEn, locationBn, priceAmount, priceCurrency,
      duration, featuresEn, featuresBn, isActive, isPaused,
      existingImages
    } = req.body;
    
    // Handle image uploads
    let images = [];
    
    // Keep existing images if provided
    if (existingImages) {
      try {
        images = JSON.parse(existingImages);
      } catch (e) {
        images = [];
      }
    }
    
    // Add new uploaded images
    if (req.files && req.files.length > 0) {
      if (images.length + req.files.length > 4) {
        return res.status(400).send('Maximum 4 images allowed per card. Please remove some existing images first.');
      }
      const startOrder = images.length;
      req.files.forEach((file, index) => {
        images.push({
          url: file.path || '/uploads/' + file.filename,
          caption: '',
          order: startOrder + index
        });
      });
    }
    
    const updateData = {
      type,
      title: { en: titleEn, bn: titleBn },
      description: { en: descriptionEn, bn: descriptionBn },
      location: { en: locationEn, bn: locationBn },
      pricing: {
        amount: priceAmount ? parseFloat(priceAmount) : 0,
        currency: priceCurrency || 'BDT',
        displayText: { en: '', bn: '' }
      },
      duration: duration || '',
      features: [],
      images,
      isActive: isActive === 'on',
      isPaused: isPaused === 'on',
      updatedAt: new Date()
    };
    
    // Parse features
    if (featuresEn) {
      const featuresEnArr = featuresEn.split('\n').filter(f => f.trim());
      const featuresBnArr = featuresBn ? featuresBn.split('\n').filter(f => f.trim()) : [];
      updateData.features = featuresEnArr.map((f, i) => ({
        en: f,
        bn: featuresBnArr[i] || ''
      }));
    }
    
    await db.collection('cards').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    res.redirect('/admin/cards');
  } catch (error) {
    console.error('Update card error:', error);
    res.status(500).send('Error updating card');
  }
};

// POST /admin/cards/delete/:id - Delete card
exports.deleteCard = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
    await db.collection('cards').deleteOne({ _id: new ObjectId(req.params.id) });
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete card error:', error);
    res.status(500).json({ success: false, error: 'Error deleting card' });
  }
};

// POST /admin/cards/toggle-status/:id - Toggle pause/resume
exports.toggleStatus = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
    const card = await db.collection('cards').findOne({ _id: new ObjectId(req.params.id) });
    
    if (!card) {
      return res.status(404).json({ success: false, error: 'Card not found' });
    }
    
    await db.collection('cards').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: { isPaused: !card.isPaused, updatedAt: new Date() } }
    );
    
    res.json({ success: true, isPaused: !card.isPaused });
  } catch (error) {
    console.error('Toggle status error:', error);
    res.status(500).json({ success: false, error: 'Error toggling status' });
  }
};

// Aliases for admin routes
exports.manageCards = exports.getCards;
