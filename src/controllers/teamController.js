const { getImageUrl } = require('../config/cloudinary');

exports.getTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();

    const founder = await db.collection('teammembers').findOne({ isFounder: true });
    const employees = await db.collection('teammembers').find({ isFounder: { $ne: true } })
      .sort({ order: 1, createdAt: -1 })
      .toArray();

    res.render('admin/team/manage', {
      admin: req.admin,
      founder: founder || null,
      employees
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).send('Error loading team members: ' + error.message);
  }
};

// POST /admin/team/founder - Update founder info
exports.updateFounder = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { nameEn, nameBn, designationEn, designationBn, bioEn, bioBn, quoteEn, quoteBn, facebook, linkedin, twitter } = req.body;

    let photoUrl = req.body.existingPhoto || '';
    if (req.file) {
      photoUrl = getImageUrl(req.file, 'team');
    }

    const founderData = {
      name: { en: nameEn || '', bn: nameBn || '' },
      designation: { en: designationEn || '', bn: designationBn || '' },
      bio: { en: bioEn || '', bn: bioBn || '' },
      quote: { en: quoteEn || '', bn: quoteBn || '' },
      photo: { url: photoUrl, alt: nameEn || '' },
      socialLinks: { facebook: facebook || '', linkedin: linkedin || '', twitter: twitter || '' },
      isFounder: true,
      isActive: true,
      updatedAt: new Date()
    };

    // Upsert - update existing founder or create one
    await db.collection('teammembers').updateOne(
      { isFounder: true },
      { $set: founderData },
      { upsert: true }
    );

    res.redirect('/admin/team');
  } catch (error) {
    console.error('Update founder error:', error);
    res.status(500).send('Error updating founder: ' + error.message);
  }
};

// POST /admin/team/create - Create new employee
exports.createMember = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { nameEn, nameBn, designationEn, designationBn, facebook, linkedin, twitter, isActive, order } = req.body;

    let photoUrl = '';
    if (req.file) {
      photoUrl = getImageUrl(req.file, 'team');
    }

    const member = {
      name: { en: nameEn || '', bn: nameBn || '' },
      designation: { en: designationEn || '', bn: designationBn || '' },
      photo: { url: photoUrl, alt: nameEn || '' },
      socialLinks: { facebook: facebook || '', linkedin: linkedin || '', twitter: twitter || '' },
      isFounder: false,
      isActive: isActive !== 'false',
      order: order ? parseInt(order) : 0,
      createdAt: new Date()
    };

    await db.collection('teammembers').insertOne(member);
    res.redirect('/admin/team');
  } catch (error) {
    console.error('Create member error:', error);
    res.status(500).send('Error creating team member: ' + error.message);
  }
};

// POST /admin/team/update/:id - Update employee
exports.updateMember = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { nameEn, nameBn, designationEn, designationBn, facebook, linkedin, twitter, isActive, order } = req.body;

    let photoUrl = req.body.existingPhoto || '';
    if (req.file) {
      photoUrl = getImageUrl(req.file, 'team');
    }

    const updateData = {
      name: { en: nameEn || '', bn: nameBn || '' },
      designation: { en: designationEn || '', bn: designationBn || '' },
      photo: { url: photoUrl, alt: nameEn || '' },
      socialLinks: { facebook: facebook || '', linkedin: linkedin || '', twitter: twitter || '' },
      isActive: isActive !== 'false',
      order: order ? parseInt(order) : 0,
      updatedAt: new Date()
    };

    await db.collection('teammembers').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );

    res.redirect('/admin/team');
  } catch (error) {
    console.error('Update member error:', error);
    res.status(500).send('Error updating team member: ' + error.message);
  }
};

// POST /admin/team/delete/:id - Delete employee (founders are protected)
exports.deleteMember = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');

    const member = await db.collection('teammembers').findOne({ _id: new ObjectId(req.params.id) });

    if (member?.isFounder) {
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(400).json({ success: false, error: 'Cannot delete the founder record' });
      }
      return res.status(400).send('Cannot delete the founder record');
    }

    await db.collection('teammembers').deleteOne({ _id: new ObjectId(req.params.id) });

    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect('/admin/team');
    }
  } catch (error) {
    console.error('Delete member error:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ success: false, error: 'Error deleting member' });
    } else {
      res.status(500).send('Error deleting member: ' + error.message);
    }
  }
};

// API: GET /api/team - Get all team members
exports.apiGetTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { isFounder, isActive } = req.query;

    let query = {};
    if (isFounder !== undefined) query.isFounder = isFounder === 'true';
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const teamMembers = await db.collection('teammembers').find(query)
      .sort({ isFounder: -1, order: 1, createdAt: -1 })
      .toArray();

    res.json({ success: true, teamMembers });
  } catch (error) {
    console.error('API get team error:', error);
    res.status(500).json({ success: false, error: 'Error loading team members' });
  }
};

// Aliases for admin routes
exports.manageTeam = exports.getTeam;
