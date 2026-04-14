const { protectAdmin } = require('../middleware/auth');

// GET /admin/team - List all team members
exports.getTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { type = 'all', status = 'all' } = req.query;
    
    let query = {};
    
    if (type === 'founder') {
      query.isFounder = true;
    } else if (type === 'employee') {
      query.isFounder = false;
    }
    
    if (status === 'active') {
      query.isActive = true;
    } else if (status === 'inactive') {
      query.isActive = false;
    }
    
    const teamMembers = await db.collection('teammembers').find(query)
      .sort({ isFounder: -1, order: 1, createdAt: -1 })
      .toArray();
    
    res.render('admin/team/list', {
      admin: req.admin,
      teamMembers,
      currentType: type,
      currentStatus: status
    });
  } catch (error) {
    console.error('Get team error:', error);
    res.status(500).send('Error loading team members');
  }
};

// GET /admin/team/create - Show create form
exports.getCreateTeam = (req, res) => {
  res.render('admin/team/form', {
    admin: req.admin,
    member: null,
    action: 'create'
  });
};

// POST /admin/team/create - Create new team member
exports.createTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      nameEn, nameBn, designationEn, designationBn,
      bioEn, bioBn, email, phone,
      facebook, linkedin, twitter,
      isFounder, isActive, order, joinedDate
    } = req.body;
    
    // Handle photo upload
    const photoUrl = req.files?.[0]?.filename;
    
    const teamMember = {
      name: { en: nameEn, bn: nameBn || '' },
      designation: { en: designationEn, bn: designationBn || '' },
      bio: { en: bioEn || '', bn: bioBn || '' },
      photo: {
        url: photoUrl ? '/uploads/' + photoUrl : '',
        alt: nameEn
      },
      email: email || '',
      phone: phone || '',
      socialLinks: {
        facebook: facebook || '',
        linkedin: linkedin || '',
        twitter: twitter || ''
      },
      isFounder: isFounder === 'on',
      isActive: isActive === 'on',
      order: order ? parseInt(order) : 0,
      joinedDate: joinedDate ? new Date(joinedDate) : null,
      createdAt: new Date()
    };
    
    const result = await db.collection('teammembers').insertOne(teamMember);
    
    res.redirect('/admin/team');
  } catch (error) {
    console.error('Create team error:', error);
    res.status(500).send('Error creating team member');
  }
};

// GET /admin/team/edit/:id - Show edit form
exports.getEditTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const member = await db.collection('teammembers').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (!member) {
      return res.status(404).send('Team member not found');
    }
    
    res.render('admin/team/form', {
      admin: req.admin,
      member,
      action: 'edit'
    });
  } catch (error) {
    console.error('Get edit team error:', error);
    res.status(500).send('Error loading team member');
  }
};

// POST /admin/team/update/:id - Update team member
exports.updateTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { 
      nameEn, nameBn, designationEn, designationBn,
      bioEn, bioBn, email, phone,
      facebook, linkedin, twitter,
      isFounder, isActive, order, joinedDate,
      existingPhoto
    } = req.body;
    
    // Handle photo
    let photoUrl = existingPhoto || '';
    if (req.files && req.files.length > 0) {
      photoUrl = '/uploads/' + req.files[0].filename;
    }
    
    const updateData = {
      name: { en: nameEn, bn: nameBn || '' },
      designation: { en: designationEn, bn: designationBn || '' },
      bio: { en: bioEn || '', bn: bioBn || '' },
      photo: {
        url: photoUrl,
        alt: nameEn
      },
      email: email || '',
      phone: phone || '',
      socialLinks: {
        facebook: facebook || '',
        linkedin: linkedin || '',
        twitter: twitter || ''
      },
      isFounder: isFounder === 'on',
      isActive: isActive === 'on',
      order: order ? parseInt(order) : 0,
      joinedDate: joinedDate ? new Date(joinedDate) : null,
      createdAt: new Date()
    };
    
    await db.collection('teammembers').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    res.redirect('/admin/team');
  } catch (error) {
    console.error('Update team error:', error);
    res.status(500).send('Error updating team member');
  }
};

// POST /admin/team/delete/:id - Delete team member
exports.deleteTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
    const member = await db.collection('teammembers').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    // Prevent deleting if it's the only founder
    if (member?.isFounder) {
      const founderCount = await db.collection('teammembers').countDocuments({ isFounder: true });
      if (founderCount <= 1) {
        if (req.xhr || req.headers.accept?.includes('application/json')) {
          return res.status(400).json({ success: false, error: 'Cannot delete the only founder' });
        } else {
          return res.status(400).send('Cannot delete the only founder');
        }
      }
    }
    
    await db.collection('teammembers').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.json({ success: true });
    } else {
      res.redirect('/admin/team');
    }
  } catch (error) {
    console.error('Delete team error:', error);
    if (req.xhr || req.headers.accept?.includes('application/json')) {
      res.status(500).json({ success: false, error: 'Error deleting team member' });
    } else {
      res.status(500).send('Error deleting team member');
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

// API: POST /api/team - Create team member
exports.apiCreateTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { 
      name, designation, bio, photo, email, phone, 
      socialLinks, isFounder, order, joinedDate 
    } = req.body;
    
    const teamMember = {
      name: { en: name?.en || '', bn: name?.bn || '' },
      designation: { en: designation?.en || '', bn: designation?.bn || '' },
      bio: { en: bio?.en || '', bn: bio?.bn || '' },
      photo: photo || { url: '', alt: '' },
      email: email || '',
      phone: phone || '',
      socialLinks: socialLinks || {},
      isFounder: isFounder || false,
      isActive: true,
      order: order || 0,
      joinedDate: joinedDate ? new Date(joinedDate) : null,
      createdAt: new Date()
    };
    
    const result = await db.collection('teammembers').insertOne(teamMember);
    
    res.json({ success: true, member: result.ops[0] });
  } catch (error) {
    console.error('API create team error:', error);
    res.status(500).json({ success: false, error: 'Error creating team member' });
  }
};

// API: PUT /api/team/:id - Update team member
exports.apiUpdateTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    const { name, designation, bio, photo, email, phone, socialLinks, isFounder, isActive, order } = req.body;
    
    const updateData = {};
    
    if (name) updateData.name = name;
    if (designation) updateData.designation = designation;
    if (bio) updateData.bio = bio;
    if (photo) updateData.photo = photo;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (socialLinks) updateData.socialLinks = socialLinks;
    if (isFounder !== undefined) updateData.isFounder = isFounder;
    if (isActive !== undefined) updateData.isActive = isActive;
    if (order !== undefined) updateData.order = order;
    
    await db.collection('teammembers').updateOne(
      { _id: new ObjectId(req.params.id) },
      { $set: updateData }
    );
    
    const updated = await db.collection('teammembers').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    res.json({ success: true, member: updated });
  } catch (error) {
    console.error('API update team error:', error);
    res.status(500).json({ success: false, error: 'Error updating team member' });
  }
};

// API: DELETE /api/team/:id - Delete team member
exports.apiDeleteTeam = async (req, res) => {
  try {
    const db = await req.app.locals.getDb();
    const { ObjectId } = require('mongodb');
    
    const member = await db.collection('teammembers').findOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    if (member?.isFounder) {
      const founderCount = await db.collection('teammembers').countDocuments({ isFounder: true });
      if (founderCount <= 1) {
        return res.status(400).json({ success: false, error: 'Cannot delete the only founder' });
      }
    }
    
    await db.collection('teammembers').deleteOne({ 
      _id: new ObjectId(req.params.id) 
    });
    
    res.json({ success: true });
  } catch (error) {
    console.error('API delete team error:', error);
    res.status(500).json({ success: false, error: 'Error deleting team member' });
  }
};

// Aliases for admin routes
exports.manageTeam = exports.getTeam;
exports.updateFounder = exports.createTeam;
exports.createMember = exports.createTeam;
exports.updateMember = exports.updateTeam;
exports.deleteMember = exports.deleteTeam;
