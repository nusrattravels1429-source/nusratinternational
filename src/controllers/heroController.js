const { ObjectId } = require('mongodb');

exports.getSlides = async (req, res) => {
  try {
    const db = req.app.locals.getDb();
    const slides = await db.collection('sitecontents')
      .find({ section: 'homepage', key: { $regex: /^hero-/ } })
      .sort({ order: 1 })
      .toArray();

    res.json({ success: true, message: 'Slides fetched successfully', data: slides });
  } catch (error) {
    console.error('Error fetching slides:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch slides', error: error.message });
  }
};

exports.createSlide = async (req, res) => {
  try {
    const db = req.app.locals.getDb();
    
    if (!req.file) {
       return res.status(400).json({ success: false, message: 'Hero image is required' });
    }

    const count = await db.collection('sitecontents').countDocuments({ section: 'homepage', key: { $regex: /^hero-/ } });

    const slide = {
      key: `hero-${Date.now()}`,
      section: 'homepage',
      title: { 
          en: req.body['title.en'] || '', 
          bn: req.body['title.bn'] || '' 
      },
      caption: { 
          en: req.body['caption.en'] || '', 
          bn: req.body['caption.bn'] || '' 
      },
      imageUrl: `/uploads/hero/${req.file.filename}`,
      order: count,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('sitecontents').insertOne(slide);
    slide._id = result.insertedId;

    res.status(201).json({ success: true, message: 'Slide created successfully', data: slide });
  } catch (error) {
    console.error('Error creating slide:', error);
    res.status(500).json({ success: false, message: 'Failed to create slide', error: error.message });
  }
};

exports.updateSlide = async (req, res) => {
    try {
        const db = req.app.locals.getDb();
        const { id } = req.params;
        
        const updateDoc = {
            'title.en': req.body['title.en'] || '',
            'title.bn': req.body['title.bn'] || '',
            'caption.en': req.body['caption.en'] || '',
            'caption.bn': req.body['caption.bn'] || '',
            updatedAt: new Date()
        };

        if (req.file) {
             updateDoc.imageUrl = `/uploads/hero/${req.file.filename}`;
        }

        const result = await db.collection('sitecontents').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateDoc },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Slide not found' });
        }

        res.json({ success: true, message: 'Slide updated successfully', data: result });
    } catch (error) {
        console.error('Error updating slide:', error);
        res.status(500).json({ success: false, message: 'Failed to update slide', error: error.message });
    }
};

exports.deleteSlide = async (req, res) => {
    try {
        const db = req.app.locals.getDb();
        const { id } = req.params;

        const count = await db.collection('sitecontents').countDocuments({ section: 'homepage', key: { $regex: /^hero-/ } });

        if (count <= 1) {
            return res.status(400).json({ success: false, message: 'At least 1 slider image is required' });
        }

        const result = await db.collection('sitecontents').findOneAndDelete({ _id: new ObjectId(id) });

        if (!result) {
             return res.status(404).json({ success: false, message: 'Slide not found' });
        }

        res.json({ success: true, message: 'Slide deleted successfully', data: result });
    } catch (error) {
         console.error('Error deleting slide:', error);
         res.status(500).json({ success: false, message: 'Failed to delete slide', error: error.message });
    }
};

exports.reorderSlides = async (req, res) => {
    try {
        const db = req.app.locals.getDb();
        const items = req.body; 

        if (!Array.isArray(items)) {
             return res.status(400).json({ success: false, message: 'Invalid data format' });
        }

        const bulkOps = items.map(item => ({
            updateOne: {
                filter: { _id: new ObjectId(item._id) },
                update: { $set: { order: item.order, updatedAt: new Date() } }
            }
        }));

        if (bulkOps.length > 0) {
             await db.collection('sitecontents').bulkWrite(bulkOps);
        }

        res.json({ success: true, message: 'Slides reordered successfully', data: {} });
    } catch (error) {
         console.error('Error reordering slides:', error);
         res.status(500).json({ success: false, message: 'Failed to reorder slides', error: error.message });
    }
};
