const { ObjectId } = require('mongodb');

exports.getSlides = async (req, res) => {
  try {
    const db = req.app.locals.getDb();
    
    // Fetch slots 1 to 4
    let slides = await db.collection('sitecontents')
      .find({ section: 'homepage', key: { $in: ['hero-1', 'hero-2', 'hero-3', 'hero-4'] } })
      .toArray();

    const existingKeys = slides.map(s => s.key);
    const newSlides = [];
    
    // Initialize missing slots
    for (let i = 1; i <= 4; i++) {
        if (!existingKeys.includes(`hero-${i}`)) {
            newSlides.push({
                key: `hero-${i}`,
                section: 'homepage',
                imageUrl: '',
                order: i,
                isActive: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
    }
    
    if (newSlides.length > 0) {
        // We use insertOne in loop to ensure insertedId is mapped correctly, or we can just fetch again
        await db.collection('sitecontents').insertMany(newSlides);
        // Best to just fetch again to get the inserted IDs cleanly
        slides = await db.collection('sitecontents')
          .find({ section: 'homepage', key: { $in: ['hero-1', 'hero-2', 'hero-3', 'hero-4'] } })
          .toArray();
    }

    // Sort by order 1-4
    slides.sort((a, b) => a.order - b.order);

    res.json({ success: true, message: 'Slides fetched successfully', data: slides });
  } catch (error) {
    console.error('Error fetching slides:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch slides', error: error.message });
  }
};

exports.updateSlide = async (req, res) => {
    try {
        const db = req.app.locals.getDb();
        const { id } = req.params;
        
        const updateDoc = {
            updatedAt: new Date()
        };

        if (req.file) {
             updateDoc.imageUrl = `/uploads/hero/${req.file.filename}`;
        } else {
             return res.status(400).json({ success: false, message: 'No image provided' });
        }

        const result = await db.collection('sitecontents').findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: updateDoc },
            { returnDocument: 'after' }
        );

        if (!result) {
            return res.status(404).json({ success: false, message: 'Slide slot not found' });
        }

        res.json({ success: true, message: 'Slide image updated successfully', data: result });
    } catch (error) {
        console.error('Error updating slide:', error);
        res.status(500).json({ success: false, message: 'Failed to update slide', error: error.message });
    }
};
