const { MongoClient, ObjectId } = require('mongodb');
const bcrypt = require('bcryptjs');

async function seedDatabase() {
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error('❌ MONGODB_URI environment variable is not set');
    console.log('Please create a .env file with:');
    console.log('MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/nusrat_travels');
    process.exit(1);
  }
  
  console.log('🔗 Connecting to MongoDB...');
  
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('nusrat_travels');
    
    // Check if admin already exists
    const existingAdmin = await db.collection('admins').findOne({ username: 'admin' });
    
    if (existingAdmin) {
      console.log('⚠️  Admin user already exists. Skipping admin creation.');
    } else {
      // Create default admin user
      const hashedPassword = await bcrypt.hash('admin123', 12);
      
      const admin = {
        username: 'admin',
        email: 'admin@nusratinternational.com',
        password: hashedPassword,
        role: 'superadmin',
        isActive: true,
        createdAt: new Date(),
        lastLogin: null
      };
      
      await db.collection('admins').insertOne(admin);
      console.log('✅ Created default admin user:');
      console.log('   Username: admin');
      console.log('   Password: admin123');
      console.log('   ⚠️  Please change this password after first login!');
    }
    
    // Seed initial navigation links if none exist
    const navCount = await db.collection('navlinks').countDocuments();
    if (navCount === 0) {
      const navLinks = [
        { label: { en: 'Home | হোম', bn: '' }, url: '/', order: 1, isActive: true, parent: null },
        { label: { en: 'Ticketing | ভ্রমণ', bn: '' }, url: '/ticketing', order: 2, isActive: true, parent: null },
        { label: { en: 'Travel | ভ্রমণ', bn: '' }, url: '/travel', order: 3, isActive: true, parent: null },
        { label: { en: 'Hajj | হাজ্জ', bn: '' }, url: '/hajj', order: 4, isActive: true, parent: null },
        { label: { en: 'Work | কাজ', bn: '' }, url: '/work', order: 5, isActive: true, parent: null },
        { label: { en: 'Contact | যোগাযোগ', bn: '' }, url: '/contact', order: 6, isActive: true, parent: null },
      ];
      
      await db.collection('navlinks').insertMany(navLinks);
      console.log('✅ Created default navigation links');
    }
    
    // Seed footer settings if none exist
    const footerCount = await db.collection('footersettings').countDocuments();
    if (footerCount === 0) {
      const footer = {
        companyName: { en: 'Nusrat International', bn: 'নুসরাত ইন্টারন্যাশনাল' },
        tagline: { en: 'Your trusted partner for Hajj, Umrah, travel & work. Serving Bangladesh since 2010.', bn: '' },
        contactInfo: {
          address: { en: 'Banani, Dhaka, Bangladesh', bn: '' },
          phone: '+880 XXX XXXXXXX',
          email: 'info@nusratinternational.com'
        },
        socialLinks: {},
        mapEmbedUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3650.7194346099836!2d90.4049653103119!3d23.79300323072133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755c70e90bb671d%3A0x7eab77d0896252c0!2sBanani%20Super%20Market!5e0!3m2!1sen!2sbd!4v1771968108612!5m2!1sen!2sbd',
        copyrightText: { 
          en: '© 2026 Nusrat International Bangladesh. All rights reserved. | সর্বস্বত্ব সংরক্ষিত।',
          bn: ''
        },
        isActive: true,
        updatedAt: new Date()
      };
      
      await db.collection('footersettings').insertOne(footer);
      console.log('✅ Created default footer settings');
    }
    
    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📝 Next steps:');
    console.log('   1. Start the server: npm start');
    console.log('   2. Visit: http://localhost:3000/admin/login');
    console.log('   3. Login with username: admin, password: admin123');
    console.log('   4. Change your password immediately!');
    
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    process.exit(1);
  } finally {
    await client.close();
    console.log('👋 Database connection closed');
  }
}

seedDatabase();
