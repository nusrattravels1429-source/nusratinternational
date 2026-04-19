const { ObjectId } = require('mongodb');

// Collection name constant
const COLLECTION_NAME = 'heroSliders';

/**
 * Get hero slider document from native MongoDB
 */
async function getHeroSlider(db) {
  const collection = db.collection(COLLECTION_NAME);
  return await collection.findOne();
}

/**
 * Get or create the single hero slider document
 */
async function getOrCreateHeroSlider(db) {
  let slider = await getHeroSlider(db);
  
  if (!slider) {
    // Create default slider with 4 empty slots
    const defaultSlider = {
      slides: [
        { imageUrl: '', order: 0, isActive: true },
        { imageUrl: '', order: 1, isActive: true },
        { imageUrl: '', order: 2, isActive: true },
        { imageUrl: '', order: 3, isActive: true }
      ],
      content: DEFAULT_CONTENT,
      settings: DEFAULT_SETTINGS,
      updatedAt: new Date(),
      createdAt: new Date()
    };
    
    const result = await db.collection(COLLECTION_NAME).insertOne(defaultSlider);
    slider = { _id: result.insertedId, ...defaultSlider };
  }
  
  return slider;
}

/**
 * Save hero slider document
 */
async function saveHeroSlider(db, slider) {
  const collection = db.collection(COLLECTION_NAME);
  slider.updatedAt = new Date();
  
  if (slider._id) {
    await collection.updateOne(
      { _id: slider._id },
      { $set: slider }
    );
  } else {
    const result = await collection.insertOne(slider);
    slider._id = result.insertedId;
  }
  
  return slider;
}

module.exports = {
  getHeroSlider,
  getOrCreateHeroSlider,
  saveHeroSlider
};
