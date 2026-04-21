const { MongoClient } = require('mongodb');
require('dotenv').config();

(async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.log('No MONGODB_URI');
    process.exit(1);
  }

  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db('nusrat_travels');
    
    const collections = ['galleryitems', 'certifications', 'teammembers', 'cards', 'sitecontents', 'headerfooters', 'heroslides'];
    
    for (const collName of collections) {
      console.log(`Checking ${collName}...`);
      const items = await db.collection(collName).find({}).toArray();
      
      for (const item of items) {
        let updated = false;
        const updateDoc = { $set: {} };

        // Check single image fields
        const imageFields = ['imageUrl', 'logo', 'certificateUrl', 'headerLogo', 'footerLogo'];
        for (const field of imageFields) {
          if (item[field] && typeof item[field] === 'string' && item[field].includes('C:\\')) {
            const parts = item[field].split('\\');
            const filename = parts[parts.length - 1];
            updateDoc.$set[field] = '/uploads/' + filename;
            updated = true;
          }
        }

        // Check arrays (like sliderImages)
        if (item.sliderImages && Array.isArray(item.sliderImages)) {
          let arrUpdated = false;
          const newArr = item.sliderImages.map(img => {
            if (img && typeof img === 'string' && img.includes('C:\\')) {
              arrUpdated = true;
              const parts = img.split('\\');
              return '/uploads/' + parts[parts.length - 1];
            }
            return img;
          });
          if (arrUpdated) {
            updateDoc.$set.sliderImages = newArr;
            updated = true;
          }
        }
        
        if (updated) {
          await db.collection(collName).updateOne({ _id: item._id }, updateDoc);
          console.log(`Fixed in ${collName}:`, item._id);
        }
      }
    }
    console.log('Database fix complete.');
  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
    process.exit(0);
  }
})();
