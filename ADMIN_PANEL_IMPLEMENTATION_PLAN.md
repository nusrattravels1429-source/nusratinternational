# Admin Panel Implementation Plan - Nusrat International

## 📋 Executive Summary

This document outlines the complete implementation plan for a dynamic admin panel for the Nusrat International website. The current website is built with Node.js, Express, MongoDB, and EJS templates. It displays travel packages, Hajj packages, work packages, and static content pages.

**Current State:**
- Frontend: EJS templates with hardcoded content + some dynamic data from MongoDB
- Backend: Express.js with MongoDB connection
- Database: Collections exist for `travel_packages`, `hajj_packages`, `work_packages`, and `contents`
- Missing: Admin authentication, CRUD interfaces, dynamic content management

---

## 🎯 Objectives

1. **Secure Admin Authentication** - Login/logout with session management
2. **Dynamic Content Management** - All text, images, and layouts editable via admin panel
3. **Package/Card Management** - Create, edit, pause, delete cards for Travel, Hajj, and Work
4. **Navigation & Footer Management** - Edit links dynamically
5. **Media Library** - Upload and manage images
6. **Clean UI/UX** - Intuitive admin dashboard with proper permissions

---

## 📁 Phase 1: Project Structure Setup

### 1.1 Directory Structure to Create

```
/workspace
├── src/
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── models/
│   │   ├── Admin.js             # Admin user schema
│   │   ├── Content.js           # Dynamic content schema
│   │   ├── Package.js           # Unified package schema helper
│   │   ├── Card.js              # Card management schema
│   │   ├── Navigation.js        # Nav links schema
│   │   ├── Gallery.js           # Gallery items schema
│   │   ├── Certification.js     # Certifications schema
│   │   ├── Team.js              # Team members schema
│   │   └── Media.js             # Media library schema
│   ├── controllers/
│   │   ├── authController.js    # Login/logout logic
│   │   ├── contentController.js # Content CRUD
│   │   ├── packageController.js # Package CRUD
│   │   ├── cardController.js    # Card management
│   │   ├── navigationController.js # Nav management
│   │   ├── galleryController.js # Gallery CRUD
│   │   ├── certificationController.js # Certifications CRUD
│   │   ├── teamController.js    # Team CRUD
│   │   └── mediaController.js   # File upload handling
│   └── utils/
│       ├── cloudinary.js        # Optional: Cloud storage
│       └── validators.js        # Input validation
├── routes/
│   ├── index.js                 # Existing public routes (modify)
│   └── admin/
│       ├── index.js             # Admin routes aggregator
│       ├── auth.js              # Auth routes
│       ├── dashboard.js         # Dashboard routes
│       ├── contents.js          # Content management routes
│       ├── packages.js          # Package management routes
│       ├── cards.js             # Card management routes
│       ├── navigation.js        # Navigation management routes
│       ├── gallery.js           # Gallery management routes
│       ├── certifications.js    # Certifications management routes
│       └── team.js              # Team management routes
├── views/
│   ├── admin/                   # NEW: Admin panel views
│   │   ├── layouts/
│   │   │   └── admin-layout.ejs # Admin sidebar + header
│   │   ├── auth/
│   │   │   └── login.ejs        # Login page
│   │   ├── dashboard/
│   │   │   └── index.ejs        # Main dashboard
│   │   ├── contents/
│   │   │   ├── list.ejs         # List all content
│   │   │   └── edit.ejs         # Edit content
│   │   ├── packages/
│   │   │   ├── list.ejs         # List packages by type
│   │   │   ├── create.ejs       # Create package
│   │   │   └── edit.ejs         # Edit package
│   │   ├── cards/
│   │   │   ├── list.ejs         # List cards
│   │   │   ├── create.ejs       # Create card
│   │   │   └── edit.ejs         # Edit card
│   │   ├── navigation/
│   │   │   └── manage.ejs       # Manage nav links
│   │   ├── gallery/
│   │   │   └── manage.ejs       # Gallery management
│   │   ├── certifications/
│   │   │   └── manage.ejs       # Certifications management
│   │   └── team/
│   │       └── manage.ejs       # Team management
│   └── partials/
│       ├── header.ejs           # Modify to use dynamic nav
│       └── footer.ejs           # Modify to use dynamic footer
├── public/
│   ├── css/
│   │   └── admin.css            # Admin panel styles
│   ├── js/
│   │   └── admin.js             # Admin panel JavaScript
│   └── uploads/                 # Uploaded files directory
│       ├── packages/
│       ├── gallery/
│       ├── certifications/
│       ├── team/
│       └── content/
└── .env                         # Environment variables
```

---

## 🔐 Phase 2: Authentication System

### 2.1 Dependencies to Install

```bash
npm install bcryptjs jsonwebtoken express-session connect-mongo express-validator helmet csrf
```

### 2.2 Admin User Schema (`src/models/Admin.js`)

```javascript
const bcrypt = require('bcryptjs');

const adminSchema = {
  _id: ObjectId,
  username: String,        // Unique username
  email: String,           // Unique email
  password: String,        // Hashed password
  role: String,            // 'super-admin', 'admin', 'editor'
  permissions: [String],   // ['manage_content', 'manage_packages', 'manage_users']
  isActive: Boolean,
  lastLogin: Date,
  createdAt: Date,
  updatedAt: Date
};

// Methods:
// - comparePassword(plainPassword)
// - hashPassword()
```

### 2.3 Authentication Middleware (`src/middleware/auth.js`)

```javascript
// Functions needed:
// - ensureAuthenticated(req, res, next)
// - ensureAdminRole(requiredRole)
// - generateToken(admin)
// - verifyToken(token)
```

### 2.4 Login Flow

1. Admin visits `/admin/login`
2. Enters credentials
3. Server validates against database
4. Creates session/JWT token
5. Redirects to `/admin/dashboard`
6. All admin routes protected by middleware

### 2.5 Logout Flow

1. Admin clicks logout
2. Server destroys session/invalidates token
3. Redirects to login page

---

## 🗄️ Phase 3: Database Schema Extensions

### 3.1 New Collections Required

#### `admins` Collection
```javascript
{
  _id: ObjectId,
  username: "admin",
  email: "admin@nusrat-intl.com",
  password: "$2a$10$hashed...",
  role: "super-admin",
  permissions: ["all"],
  isActive: true,
  createdAt: ISODate(),
  updatedAt: ISODate()
}
```

#### `site_contents` Collection (for all editable content)
```javascript
{
  _id: ObjectId,
  page: String,              // 'home', 'about', 'contact', 'ticketing'
  section: String,           // 'hero', 'certifications', 'ticketing-intro'
  key: String,               // Unique identifier: 'home-hero-title'
  type: String,              // 'text', 'html', 'image', 'array'
  content: Mixed,            // String, Object, or Array
  language: String,          // 'en', 'bn', 'both'
  isActive: Boolean,
  order: Number,
  metadata: Object,          // Additional settings
  updatedAt: ISODate,
  updatedBy: ObjectId        // Reference to admin
}
```

#### `navigation_links` Collection
```javascript
{
  _id: ObjectId,
  label: { en: String, bn: String },
  url: String,
  parent: ObjectId|null,     // For dropdowns
  order: Number,
  icon: String,
  isNewTab: Boolean,
  isActive: Boolean,
  children: [ObjectId]       // Child menu items
}
```

#### `footer_settings` Collection
```javascript
{
  _id: ObjectId,
  socialLinks: [{
    platform: String,        // 'facebook', 'youtube', etc.
    url: String,
    icon: String,
    isActive: Boolean
  }],
  contactInfo: {
    phone: String,
    email: String,
    address: { en: String, bn: String },
    mapEmbedUrl: String
  },
  copyrightText: { en: String, bn: String },
  footerDescription: { en: String, bn: String }
}
```

#### `cards` Collection (unified for work, travel, hajj)
```javascript
{
  _id: ObjectId,
  type: String,              // 'work', 'travel', 'hajj'
  title: { en: String, bn: String },
  slug: String,
  shortDescription: { en: String, bn: String },
  fullDescription: { en: String, bn: String },
  coverImage: String,
  gallery: [{
    imageUrl: String,
    thumbnailUrl: String,
    caption: { en: String, bn: String },
    order: Number
  }],
  pricing: {
    amount: Number,
    currency: String,
    displayText: String
  },
  location: {
    country: String,
    city: String,
    flag: String
  },
  duration: {
    days: Number,
    displayText: String
  },
  features: [String],
  included: [String],
  excluded: [String],
  itinerary: [{
    day: Number,
    title: { en: String, bn: String },
    description: { en: String, bn: String }
  }],
  status: String,            // 'active', 'paused', 'draft'
  isFeatured: Boolean,
  order: Number,
  rating: Number,
  metaTitle: String,
  metaDescription: String,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

#### `gallery_items` Collection
```javascript
{
  _id: ObjectId,
  category: String,          // 'team', 'achievement', 'event'
  title: { en: String, bn: String },
  description: { en: String, bn: String },
  imageUrl: String,
  thumbnailUrl: String,
  order: Number,
  isActive: Boolean,
  uploadedAt: ISODate
}
```

#### `certifications` Collection
```javascript
{
  _id: ObjectId,
  title: { en: String, bn: String },
  description: { en: String, bn: String },
  logoUrl: String,
  tag: { en: String, bn: String },
  code: String,              // e.g., 'RL-1429'
  isFeatured: Boolean,
  order: Number,
  isActive: Boolean
}
```

#### `team_members` Collection
```javascript
{
  _id: ObjectId,
  name: { en: String, bn: String },
  designation: { en: String, bn: String },
  bio: { en: String, bn: String },
  photoUrl: String,
  type: String,              // 'founder', 'employee'
  order: Number,
  isActive: Boolean,
  socialLinks: [{
    platform: String,
    url: String
  }]
}
```

#### `media_library` Collection
```javascript
{
  _id: ObjectId,
  fileName: String,
  originalName: String,
  filePath: String,
  thumbnailPath: String,
  publicUrl: String,
  fileType: String,
  fileSize: Number,
  dimensions: { width: Number, height: Number },
  altText: { en: String, bn: String },
  category: String,
  tags: [String],
  uploadedBy: ObjectId,
  uploadedAt: ISODate
}
```

---

## 🎨 Phase 4: Admin Panel UI/UX Design

### 4.1 Dashboard Layout

**Sidebar Navigation:**
```
┌─────────────────────────┐
│  NUSRAT ADMIN           │
├─────────────────────────┤
│  📊 Dashboard           │
│  📝 Content Manager     │
│  🎫 Packages/Cards      │
│  🧭 Navigation          │
│  🖼️ Gallery             │
│  📜 Certifications      │
│  👥 Team Members        │
│  📁 Media Library       │
│  ⚙️ Settings            │
├─────────────────────────┤
│  👤 Admin Profile       │
│  🚪 Logout              │
└─────────────────────────┘
```

### 4.2 Page-Specific Admin Interfaces

#### 4.2.1 Landing Page Editor
- **Hero Slider Section:**
  - Add/remove slides
  - Upload background images
  - Edit title, subtitle, description (EN/BN)
  - Edit CTA button text and link
  - Reorder slides via drag-and-drop

- **Certifications Section:**
  - Edit section heading
  - Manage certification cards (CRUD)
  - Upload logos
  - Toggle featured status

- **Ticketing Section:**
  - Edit intro text
  - Manage country list (add/remove flags)
  - Update contact information

#### 4.2.2 Package/Card Management
- **List View:**
  - Filter by type (Travel/Hajj/Work)
  - Filter by status (Active/Paused/Draft)
  - Search by title
  - Quick actions (Edit, Pause, Delete)

- **Create/Edit Form:**
  - Basic Info: Title, Slug, Type
  - Description: Short + Full (with rich text editor)
  - Images: Cover + Gallery (multi-upload)
  - Pricing: Amount, Currency
  - Location: Country, City, Flag
  - Duration: Days
  - Features/Highlights (dynamic fields)
  - Included/Excluded lists
  - Itinerary (day-by-day builder)
  - SEO: Meta title, description
  - Status toggle (Active/Paused)

#### 4.2.3 About Us Section
- **Founder Section:**
  - Upload founder photo
  - Edit name, designation
  - Edit bio (rich text)
  - Edit quotes

- **Company Info:**
  - Edit company history
  - Mission/Vision text
  - Achievement highlights

#### 4.2.4 Gallery Management
- Upload multiple images
- Add title and description
- Categorize (Team/Achievement/Event)
- Reorder via drag-and-drop
- Delete with confirmation

#### 4.2.5 Certifications Management
- Add new certification
- Upload logo/image
- Edit title, description, tag
- Set featured status
- Reorder display order

#### 4.2.6 Team Management
- **Founder:**
  - Update photo, name, designation, bio
  
- **Employees:**
  - Add employee card
  - Upload photo
  - Edit name, designation
  - Add social links
  - Delete employee

#### 4.2.7 Navigation Manager
- Visual menu builder
- Add/remove links
- Create dropdowns
- Set order (drag-and-drop)
- Toggle active/inactive
- Set target (_self/_blank)

#### 4.2.8 Footer Manager
- Edit social media links
- Update contact info
- Edit copyright text
- Update map embed URL

---

## 🔧 Phase 5: Backend Implementation Steps

### Step 1: Install Dependencies
```bash
npm install bcryptjs jsonwebtoken express-session connect-mongo 
npm install express-validator multer helmet csurf
npm install slugify sharp (for image optimization)
```

### Step 2: Create Database Models
- Create all Mongoose schemas or MongoDB native schema validators
- Add indexes for performance
- Create seed script for initial admin user

### Step 3: Implement Authentication
- Create login route (POST /admin/login)
- Create logout route (POST /admin/logout)
- Create session middleware
- Protect all admin routes

### Step 4: Create Admin Controllers
For each section:
- `list()` - Get all items
- `getById()` - Get single item
- `create()` - Create new item
- `update()` - Update existing item
- `delete()` - Delete item
- `toggleStatus()` - Pause/resume
- `reorder()` - Change display order

### Step 5: Implement File Upload
- Configure multer for file uploads
- Create upload routes
- Generate thumbnails
- Store metadata in `media_library`
- Validate file types and sizes

### Step 6: Create API Endpoints
```
Authentication:
POST   /admin/api/login
POST   /admin/api/logout
GET    /admin/api/me

Content:
GET    /admin/api/contents
POST   /admin/api/contents
PUT    /admin/api/contents/:id
DELETE /admin/api/contents/:id

Packages/Cards:
GET    /admin/api/packages?type=travel|hajj|work
POST   /admin/api/packages
PUT    /admin/api/packages/:id
DELETE /admin/api/packages/:id
PATCH  /admin/api/packages/:id/status

Navigation:
GET    /admin/api/navigation
POST   /admin/api/navigation
PUT    /admin/api/navigation/:id
DELETE /admin/api/navigation/:id
PUT    /admin/api/navigation/reorder

Gallery:
GET    /admin/api/gallery
POST   /admin/api/gallery
DELETE /admin/api/gallery/:id

Certifications:
GET    /admin/api/certifications
POST   /admin/api/certifications
PUT    /admin/api/certifications/:id
DELETE /admin/api/certifications/:id

Team:
GET    /admin/api/team
POST   /admin/api/team
PUT    /admin/api/team/:id
DELETE /admin/api/team/:id

Media:
GET    /admin/api/media
POST   /admin/api/media/upload
DELETE /admin/api/media/:id
```

---

## 🌐 Phase 6: Frontend Integration

### 6.1 Modify Existing Routes

Update `routes/index.js` to fetch dynamic content:

```javascript
// Before (hardcoded):
res.render('index', { ... });

// After (dynamic):
const db = await getDb(req);
const homepageContent = await db.collection('site_contents')
  .find({ page: 'home', isActive: true })
  .toArray();
const navLinks = await db.collection('navigation_links')
  .find({ isActive: true }).sort({ order: 1 }).toArray();
const footerSettings = await db.collection('footer_settings').findOne();

res.render('index', {
  homepageContent,
  navLinks,
  footerSettings,
  ...
});
```

### 6.2 Update Partials

**header.ejs:**
```ejs
<ul class="nav-links">
  <% navLinks.forEach(link => { %>
    <% if (link.children && link.children.length > 0) { %>
      <li class="has-dropdown">
        <button class="dropdown-trigger">
          <%= link.label[lang] %> ▾
        </button>
        <ul class="dropdown-menu">
          <% link.children.forEach(child => { %>
            <li><a href="<%= child.url %>"><%= child.label[lang] %></a></li>
          <% }); %>
        </ul>
      </li>
    <% } else { %>
      <li><a href="<%= link.url %>"><%= link.label[lang] %></a></li>
    <% } %>
  <% }); %>
</ul>
```

**footer.ejs:**
```ejs
<div class="social-links">
  <% footerSettings.socialLinks.forEach(social => { %>
    <% if (social.isActive) { %>
      <a href="<%= social.url %>"><%= social.icon %></a>
    <% } %>
  <% }); %>
</div>
```

---

## 📝 Phase 7: Step-by-Step Implementation Guide

### Week 1: Foundation
1. ✅ Set up directory structure
2. ✅ Install dependencies
3. ✅ Create database schemas
4. ✅ Implement authentication system
5. ✅ Create admin layout template

### Week 2: Core Features
6. ✅ Build dashboard home
7. ✅ Implement content management (CRUD)
8. ✅ Create package/card management
9. ✅ Add file upload functionality

### Week 3: Advanced Features
10. ✅ Build navigation manager
11. ✅ Create gallery management
12. ✅ Implement certifications manager
13. ✅ Build team management

### Week 4: Integration & Polish
14. ✅ Connect admin panel to public pages
15. ✅ Update all views to use dynamic content
16. ✅ Add validation and error handling
17. ✅ Implement permissions system
18. ✅ Test all features
19. ✅ Optimize performance
20. ✅ Security audit

---

## 🔒 Phase 8: Security Considerations

### 8.1 Authentication Security
- Use bcrypt with salt rounds (12+)
- Implement rate limiting on login
- Use secure session cookies (httpOnly, secure, sameSite)
- Implement CSRF protection
- Add brute force protection

### 8.2 Authorization
- Role-based access control (RBAC)
- Permission checks on every route
- Validate ownership before edits

### 8.3 Input Validation
- Sanitize all inputs
- Validate file uploads (type, size)
- Prevent XSS attacks
- Use parameterized queries

### 8.4 File Upload Security
- Restrict file types (images only)
- Limit file size (e.g., 5MB)
- Rename files to prevent overwrites
- Store outside web root if possible
- Scan for malware (optional)

---

## 🎯 Phase 9: Testing Checklist

### Authentication
- [ ] Login with valid credentials
- [ ] Login with invalid credentials
- [ ] Logout functionality
- [ ] Session timeout
- [ ] Protected route access without auth

### Content Management
- [ ] Create content
- [ ] Edit content
- [ ] Delete content
- [ ] Toggle active/inactive
- [ ] Multi-language support

### Package/Card Management
- [ ] Create travel package
- [ ] Create hajj package
- [ ] Create work package
- [ ] Upload multiple images
- [ ] Pause/resume package
- [ ] Delete package
- [ ] Featured toggle

### Navigation
- [ ] Add menu item
- [ ] Create dropdown
- [ ] Reorder items
- [ ] Delete menu item

### Gallery
- [ ] Upload images
- [ ] Add captions
- [ ] Delete images
- [ ] Categorize images

### Certifications
- [ ] Add certification
- [ ] Upload logo
- [ ] Edit details
- [ ] Delete certification

### Team
- [ ] Update founder info
- [ ] Add employee
- [ ] Edit employee
- [ ] Delete employee

### Integration
- [ ] Public pages show dynamic content
- [ ] Navigation updates reflect immediately
- [ ] Footer updates reflect immediately
- [ ] Images load correctly

---

## 🚀 Deployment Considerations

### Environment Variables (.env)
```env
# Database
MONGODB_URI=mongodb+srv://...

# Authentication
JWT_SECRET=your-secret-key
SESSION_SECRET=your-session-secret

# Server
PORT=3000
NODE_ENV=production

# File Upload
MAX_FILE_SIZE=5242880
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp

# Admin
ADMIN_EMAIL=admin@nusrat-intl.com
ADMIN_PASSWORD=change-me-immediately
```

### Vercel Configuration
- Update `vercel.json` for serverless functions
- Configure environment variables in Vercel dashboard
- Set up MongoDB Atlas IP whitelist for Vercel IPs

---

## 📊 Success Metrics

1. **Admin can log in securely** ✅
2. **All landing page content editable** ✅
3. **Packages can be created/edited/deleted** ✅
4. **Cards can be paused/resumed** ✅
5. **Navigation is fully dynamic** ✅
6. **Footer is fully dynamic** ✅
7. **Gallery management works** ✅
8. **Certifications manageable** ✅
9. **Team section manageable** ✅
10. **All changes persist to MongoDB** ✅
11. **Public site reflects changes** ✅
12. **Logout works securely** ✅

---

## 🛠️ Tools & Technologies

| Purpose | Technology |
|---------|-----------|
| Backend Framework | Express.js |
| Template Engine | EJS |
| Database | MongoDB (Atlas) |
| Authentication | JWT + Sessions |
| Password Hashing | bcryptjs |
| File Upload | Multer |
| Image Processing | Sharp (optional) |
| Validation | express-validator |
| Security | Helmet, csurf |
| Rich Text Editor | CKEditor or Quill |
| Drag & Drop | SortableJS |
| CSS Framework | Custom or Tailwind |

---

## 📞 Next Steps

1. **Review this plan** with stakeholders
2. **Prioritize features** (MVP vs. nice-to-have)
3. **Set up development environment**
4. **Start with Phase 1** (Project Structure)
5. **Implement iteratively** following the phases
6. **Test continuously** after each feature
7. **Deploy to staging** for UAT
8. **Launch production** after approval

---

## ⚠️ Important Notes

- **Backup database** before making changes
- **Use version control** (Git) for all changes
- **Document all API endpoints**
- **Create admin user manual** after completion
- **Plan for data migration** from hardcoded to dynamic
- **Consider SEO implications** of dynamic content
- **Implement caching** for better performance
- **Monitor performance** after deployment

---

*This document serves as a comprehensive guide for implementing the admin panel. Each phase should be completed and tested before moving to the next.*
