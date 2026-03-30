# MongoDB Database Schema for Nusrat International
## Dynamic Content Management System

This schema is designed to make all text, images, cards, hyperlinks, and other content dynamic in your Nusrat International project using MongoDB.

---

## 📁 Collection Structure

### 1. **pages** Collection
Stores all pages and their sections dynamically.

```javascript
{
  _id: ObjectId,
  slug: "home", // e.g., "home", "about", "hajj", "travel"
  title: "Home Page",
  metaDescription: "Welcome to Nusrat International",
  isActive: true,
  createdAt: ISODate,
  updatedAt: ISODate,
  sections: [
    {
      sectionId: "hero-section",
      sectionType: "hero", // hero, features, services, gallery, testimonials, cta
      order: 1,
      isVisible: true,
      content: {
        heading: "Welcome to Nusrat International",
        subheading: "Your trusted partner for Hajj & Travel",
        backgroundImage: "/uploads/images/hero-bg.jpg",
        buttonText: "Explore Services",
        buttonLink: "/services"
      }
    },
    {
      sectionId: "services-cards",
      sectionType: "cards",
      order: 2,
      isVisible: true,
      content: {
        heading: "Our Services",
        cards: [
          {
            cardId: "card-1",
            icon: "/uploads/icons/hajj-icon.png",
            title: "Hajj Services",
            description: "Complete Hajj pilgrimage packages",
            link: "/hajj",
            linkText: "Learn More",
            order: 1
          },
          {
            cardId: "card-2",
            icon: "/uploads/icons/travel-icon.png",
            title: "Travel Services",
            description: "International travel solutions",
            link: "/travel",
            linkText: "Learn More",
            order: 2
          }
        ]
      }
    }
  ]
}
```

---

### 2. **content_items** Collection
Individual reusable content items (text blocks, images, links).

```javascript
{
  _id: ObjectId,
  itemType: "text", // text, image, card, hyperlink, video, testimonial
  category: "homepage", // homepage, about, hajj, travel, global
  title: "Welcome Message",
  content: {
    text: "Welcome to Nusrat International...",
    imageUrl: "/uploads/images/welcome.jpg",
    imageAlt: "Welcome image",
    linkUrl: "/about",
    linkText: "Read More",
    metadata: {
      fontWeight: "bold",
      fontSize: "18px",
      color: "#333"
    }
  },
  tags: ["welcome", "homepage", "intro"],
  isActive: true,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

### 3. **navigation** Collection
Dynamic menu and navigation links.

```javascript
{
  _id: ObjectId,
  menuType: "main", // main, footer, sidebar
  language: "en", // en, ar
  isActive: true,
  items: [
    {
      itemId: "nav-1",
      label: "Home",
      url: "/",
      icon: "/uploads/icons/home-icon.png",
      order: 1,
      hasSubmenu: false,
      submenu: []
    },
    {
      itemId: "nav-2",
      label: "Services",
      url: "#",
      icon: "/uploads/icons/services-icon.png",
      order: 2,
      hasSubmenu: true,
      submenu: [
        {
          label: "Hajj",
          url: "/hajj",
          order: 1
        },
        {
          label: "Travel",
          url: "/travel",
          order: 2
        },
        {
          label: "Ticketing",
          url: "/ticketing",
          order: 3
        }
      ]
    }
  ]
}
```

---

### 4. **gallery** Collection
Image gallery with categories.

```javascript
{
  _id: ObjectId,
  title: "Hajj Gallery 2024",
  category: "hajj", // hajj, travel, events, office
  description: "Photos from Hajj season 2024",
  isActive: true,
  order: 1,
  images: [
    {
      imageId: "img-1",
      imageUrl: "/uploads/gallery/hajj-2024-01.jpg",
      thumbnailUrl: "/uploads/gallery/thumbs/hajj-2024-01.jpg",
      altText: "Pilgrims at Kaaba",
      caption: "Group photo at Holy Kaaba",
      order: 1,
      uploadedAt: ISODate
    },
    {
      imageId: "img-2",
      imageUrl: "/uploads/gallery/hajj-2024-02.jpg",
      thumbnailUrl: "/uploads/gallery/thumbs/hajj-2024-02.jpg",
      altText: "Mina tents",
      caption: "Accommodation in Mina",
      order: 2,
      uploadedAt: ISODate
    }
  ],
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

### 5. **employees** Collection
Dynamic employee/team member profiles.

```javascript
{
  _id: ObjectId,
  name: "Ahmed Ali",
  position: "CEO",
  department: "Management",
  bio: "20+ years of experience in Hajj and travel services",
  imageUrl: "/uploads/employees/ahmed-ali.jpg",
  email: "ahmed@nusrat-intl.com",
  phone: "+966-XXX-XXXX",
  socialLinks: {
    linkedin: "https://linkedin.com/in/ahmedali",
    twitter: "https://twitter.com/ahmedali"
  },
  order: 1,
  isActive: true,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

### 6. **certifications** Collection
Dynamic certifications and achievements.

```javascript
{
  _id: ObjectId,
  title: "ISO 9001:2015 Certified",
  issuingOrganization: "International Standards Organization",
  issueDate: ISODate("2023-01-15"),
  expiryDate: ISODate("2026-01-15"),
  certificateNumber: "ISO-2023-12345",
  description: "Quality management system certification",
  imageUrl: "/uploads/certifications/iso-9001.jpg",
  verificationUrl: "https://verify.iso.org/12345",
  category: "quality", // quality, safety, religious, government
  order: 1,
  isActive: true,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

### 7. **packages** Collection
Dynamic Hajj, Travel, and Work packages.

```javascript
{
  _id: ObjectId,
  packageType: "hajj", // hajj, travel, work
  title: "Premium Hajj Package 2024",
  slug: "premium-hajj-2024",
  description: "Complete Hajj package with 5-star accommodation",
  shortDescription: "5-star Hajj package",
  price: 15000,
  currency: "SAR",
  duration: "30 days",
  features: [
    "5-star hotel near Haram",
    "Visa processing",
    "Round-trip flights",
    "Guided tours",
    "Meals included"
  ],
  images: [
    {
      imageUrl: "/uploads/packages/hajj-premium-01.jpg",
      altText: "Hotel view",
      order: 1
    },
    {
      imageUrl: "/uploads/packages/hajj-premium-02.jpg",
      altText: "Room interior",
      order: 2
    }
  ],
  itinerary: [
    {
      day: 1,
      title: "Arrival in Makkah",
      description: "Check-in and rest"
    },
    {
      day: 2,
      title: "Umrah",
      description: "Perform Umrah with guidance"
    }
  ],
  availability: {
    isAvailable: true,
    startDate: ISODate("2024-06-01"),
    endDate: ISODate("2024-08-31"),
    spotsTotal: 100,
    spotsBooked: 45
  },
  isActive: true,
  order: 1,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

### 8. **site_settings** Collection
Global site configuration.

```javascript
{
  _id: ObjectId,
  settingKey: "site_config",
  settingValue: {
    siteName: "Nusrat International",
    tagline: "Your Trusted Partner",
    logo: "/uploads/logo.png",
    favicon: "/uploads/favicon.ico",
    contactEmail: "info@nusrat-intl.com",
    contactPhone: "+966-XXX-XXXX",
    address: "Riyadh, Saudi Arabia",
    socialMedia: {
      facebook: "https://facebook.com/nusratintl",
      twitter: "https://twitter.com/nusratintl",
      instagram: "https://instagram.com/nusratintl",
      linkedin: "https://linkedin.com/company/nusratintl"
    },
    seo: {
      defaultTitle: "Nusrat International - Hajj & Travel Services",
      defaultDescription: "Leading Hajj and travel services provider",
      keywords: ["hajj", "travel", "umrah", "saudi arabia"]
    },
    colors: {
      primary: "#1a5f7a",
      secondary: "#159895",
      accent: "#57c5b6"
    },
    fonts: {
      heading: "Arial",
      body: "Roboto"
    }
  },
  updatedAt: ISODate
}
```

---

### 9. **contact_submissions** Collection
Store contact form submissions.

```javascript
{
  _id: ObjectId,
  name: "John Doe",
  email: "john@example.com",
  phone: "+1-234-567-8900",
  subject: "Inquiry about Hajj package",
  message: "I want to know more about your premium packages...",
  serviceInterest: "hajj", // hajj, travel, ticketing, work, general
  status: "new", // new, contacted, resolved
  submittedAt: ISODate,
  respondedAt: ISODate,
  adminNotes: "Follow up required"
}
```

---

### 10. **media_library** Collection
Track all uploaded images and files.

```javascript
{
  _id: ObjectId,
  fileName: "hajj-hero-image.jpg",
  originalName: "IMG_20240115.jpg",
  filePath: "/uploads/images/hajj-hero-image.jpg",
  thumbnailPath: "/uploads/images/thumbs/hajj-hero-image.jpg",
  fileType: "image/jpeg", // image/jpeg, image/png, application/pdf
  fileSize: 2458624, // in bytes
  dimensions: {
    width: 1920,
    height: 1080
  },
  altText: "Hajj pilgrims",
  caption: "Pilgrims at Masjid al-Haram",
  category: "hajj", // hajj, travel, employees, certifications, general
  uploadedBy: "admin",
  uploadedAt: ISODate,
  usageCount: 5, // how many times this image is used across the site
  tags: ["hajj", "makkah", "kaaba", "pilgrims"]
}
```

---

## 🖼️ Image Upload Strategy

### Folder Structure (on server):
```
/uploads
  /images
    /thumbs (auto-generated thumbnails)
  /gallery
    /thumbs
  /employees
  /certifications
  /packages
  /icons
  /logo.png
  /favicon.ico
```

### Upload Process:
1. **Frontend**: Use `<input type="file">` with multipart/form-data
2. **Backend**: 
   - Receive file
   - Validate (type, size)
   - Generate unique filename
   - Save to `/uploads` folder
   - Create thumbnail (if image)
   - Store metadata in `media_library` collection
   - Return file URL to frontend
3. **Database**: Reference the file URL in respective collections

### Example Upload API (Node.js + Express + Multer):
```javascript
const multer = require('multer');
const path = require('path');

// Storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = `./uploads/${req.body.category || 'general'}`;
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + '-' + Math.round(Math.random() * 1E9) + path.extname(file.originalname);
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed'));
  }
});

// Upload endpoint
app.post('/api/upload', upload.single('image'), async (req, res) => {
  // Save to media_library collection
  const mediaDoc = {
    fileName: req.file.filename,
    originalName: req.file.originalname,
    filePath: req.file.path,
    fileType: req.file.mimetype,
    fileSize: req.file.size,
    category: req.body.category,
    altText: req.body.altText,
    uploadedAt: new Date()
  };
  
  const savedMedia = await db.collection('media_library').insertOne(mediaDoc);
  
  res.json({
    success: true,
    url: `/uploads/${req.body.category}/${req.file.filename}`,
    mediaId: savedMedia.insertedId
  });
});
```

---

## 🔧 Implementation Benefits

✅ **Fully Dynamic**: All content manageable from admin panel  
✅ **Scalable**: Easy to add new sections, pages, or content types  
✅ **SEO-Friendly**: Meta tags, slugs, and descriptions stored in DB  
✅ **Multi-language Ready**: Add language field to any collection  
✅ **Version Control**: Track changes with createdAt/updatedAt  
✅ **Media Management**: Centralized image library with reuse tracking  
✅ **Flexible Schema**: MongoDB allows evolving structure without migrations  

---

## 📝 Sample Queries

### Get active homepage sections:
```javascript
db.pages.findOne({ slug: "home", isActive: true })
```

### Get all active Hajj packages:
```javascript
db.packages.find({ packageType: "hajj", isActive: true })
```

### Get gallery by category:
```javascript
db.gallery.findOne({ category: "hajj", isActive: true })
```

### Search media by tag:
```javascript
db.media_library.find({ tags: { $in: ["hajj", "makkah"] } })
```

### Update a page section:
```javascript
db.pages.updateOne(
  { slug: "home", "sections.sectionId": "hero-section" },
  { $set: { "sections.$.content.heading": "New Welcome Message" } }
)
```

---

## 🚀 Next Steps

1. **Set up MongoDB** (local or cloud like MongoDB Atlas)
2. **Create backend API** (Node.js/Express, Python/Django, etc.)
3. **Implement file upload** with Multer (Node.js) or similar
4. **Build admin panel** to manage all collections
5. **Update frontend** to fetch data from API instead of hardcoded HTML
6. **Add caching** for better performance (Redis)

Would you like me to create:
- Backend API code (Node.js/Express)?
- Admin panel UI?
- Frontend integration examples?
- Docker setup for MongoDB?
