const Message = require('../models/Message');

// Public: Submit a message
exports.submitMessage = async (req, res) => {
  try {
    const { name, email, phone, service, message, source, packageId, packageName } = req.body;

    // Validate that at least email or phone is provided
    if (!email && !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Please provide either an email or a phone number.' 
      });
    }

    const newMessage = new Message({
      name,
      email,
      phone,
      service: service || 'General Inquiry',
      message,
      source: source || 'Other',
      metadata: {
        packageId,
        packageName,
        url: req.get('referer')
      }
    });

    await newMessage.save();

    res.status(201).json({
      success: true,
      message: 'Your message has been sent successfully!'
    });
  } catch (error) {
    console.error('Submit message error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while sending your message. Please try again later.'
    });
  }
};

// Admin: Get all messages
exports.getInbox = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    
    res.render('admin/inbox/list', {
      admin: req.admin,
      messages,
      activePage: 'inbox',
      pageTitle: '📥 Inbox - Admin Panel'
    });
  } catch (error) {
    console.error('Get inbox error:', error);
    res.status(500).send('Error loading inbox');
  }
};

// Admin: Mark as read
exports.markAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndUpdate(id, { isRead: true });
    res.json({ success: true });
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ success: false, error: 'Error updating message' });
  }
};

// Admin: Delete message
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await Message.findByIdAndDelete(id);
    res.json({ success: true });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ success: false, error: 'Error deleting message' });
  }
};

// API: Get unread count (for badge)
exports.getUnreadCount = async (req, res) => {
  try {
    const count = await Message.countDocuments({ isRead: false });
    res.json({ success: true, count });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
