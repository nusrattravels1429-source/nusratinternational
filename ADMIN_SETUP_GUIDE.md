# Admin Panel Implementation - Setup Guide

## ✅ What Has Been Implemented

### 1. **Dependencies Installed**
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication
- `express-session` - Session management
- `connect-mongo` - MongoDB session store
- `express-validator` - Input validation
- `helmet` - Security headers
- `csurf` - CSRF protection
- `slugify` - URL slug generation
- `sharp` - Image processing
- `multer` - File uploads (already installed)

### 2. **Database Models Created** (`src/models/`)
- `Admin.js` - Admin user accounts
- `SiteContent.js` - Editable site content
- `Card.js` - Travel/Hajj/Work packages
- `GalleryItem.js` - Gallery photos
- `Certification.js` - Certificates
- `TeamMember.js` - Team members & founder
- `NavLink.js` - Navigation menu items
- `FooterSetting.js` - Footer configuration

### 3. **Middleware Created** (`src/middleware/`)
- `auth.js` - JWT authentication, route protection
- `upload.js` - Multer file upload configuration

### 4. **Controllers Created** (`src/controllers/`)
- `authController.js` - Login, logout, dashboard
- `cardController.js` - CRUD for cards (travel/hajj/work)

### 5. **Routes Created** (`routes/admin/`)
- `/admin/login` - Login page (GET/POST)
- `/admin/logout` - Logout (GET)
- `/admin/dashboard` - Dashboard (GET)
- `/admin/cards` - List cards with filters (GET)
- `/admin/cards/create` - Create card form (GET/POST)
- `/admin/cards/edit/:id` - Edit card form (GET/POST)
- `/admin/cards/delete/:id` - Delete card (POST)
- `/admin/cards/toggle-status/:id` - Pause/resume (POST)

### 6. **Views Created** (`views/admin/`)
- `login.ejs` - Beautiful login page
- `dashboard.ejs` - Dashboard with stats
- `cards/list.ejs` - Cards management table
- `cards/form.ejs` - Create/edit card form

### 7. **Seed Script** (`src/seed.js`)
- Creates default admin user
- Seeds navigation links
- Seeds footer settings

---

## 🚀 Setup Instructions

### Step 1: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` and add your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/nusrat_travels
JWT_SECRET=your-random-secret-key-here-change-this
NODE_ENV=production
```

**For Vercel:** Add these to your Vercel project's Environment Variables settings.

### Step 2: Run Database Seed

Initialize the database with the admin user:

```bash
npm run seed
```

This will create:
- Default admin account (username: `admin`, password: `admin123`)
- Basic navigation structure
- Footer settings

**⚠️ IMPORTANT:** Change the default password after first login!

### Step 3: Start the Server

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

### Step 4: Access Admin Panel

1. Visit: `http://localhost:3000/admin/login`
2. Login with:
   - **Username:** `admin`
   - **Password:** `admin123`
3. You'll be redirected to the dashboard

---

## 📁 Project Structure

```
/workspace
├── app.js                    # Main application (updated with admin routes)
├── package.json              # Dependencies
├── .env.example              # Environment template
├── src/
│   ├── models/               # Mongoose schemas
│   │   ├── Admin.js
│   │   ├── SiteContent.js
│   │   ├── Card.js
│   │   ├── GalleryItem.js
│   │   ├── Certification.js
│   │   ├── TeamMember.js
│   │   ├── NavLink.js
│   │   └── FooterSetting.js
│   ├── controllers/          # Route handlers
│   │   ├── authController.js
│   │   └── cardController.js
│   ├── middleware/           # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── config/
│   │   └── database.js
│   └── seed.js               # Database seeder
├── routes/
│   ├── index.js              # Public routes
│   └── admin/
│       └── index.js          # Admin routes
├── views/
│   ├── admin/                # Admin panel views
│   │   ├── login.ejs
│   │   ├── dashboard.ejs
│   │   └── cards/
│   │       ├── list.ejs
│   │       └── form.ejs
│   └── partials/             # Shared partials
└── public/
    └── uploads/              # Uploaded files
        └── admin/
```

---

## 🔐 Security Features

1. **Password Hashing** - bcrypt with 12 salt rounds
2. **JWT Authentication** - Secure token-based auth
3. **HttpOnly Cookies** - Prevents XSS attacks
4. **Route Protection** - Middleware protects all admin routes
5. **Input Validation** - Sanitizes user input
6. **File Upload Restrictions** - Only images, max 5MB

---

## 🎨 Features Implemented

### Card Management
- ✅ Create travel/hajj/work packages
- ✅ Bilingual support (English & Bengali)
- ✅ Multiple image uploads
- ✅ Pricing & location fields
- ✅ Features list
- ✅ Active/inactive status
- ✅ Pause/resume functionality
- ✅ Delete with confirmation
- ✅ Filter by type and status

### Authentication
- ✅ Secure login page
- ✅ Session persistence (7 days)
- ✅ Logout functionality
- ✅ Protected routes

### Dashboard
- ✅ Statistics overview
- ✅ Quick action buttons
- ✅ Responsive sidebar navigation

---

## 📋 Next Steps to Complete

### Priority 1: Content Management
1. **Site Content Controller** - For homepage, about, ticketing sections
2. **Gallery Controller** - Upload/manage gallery items
3. **Certification Controller** - Manage certificates
4. **Team Controller** - Manage team members & founder

### Priority 2: Navigation & Footer
1. **Navigation Manager** - Add/edit/remove menu items
2. **Footer Editor** - Update contact info, social links

### Priority 3: Frontend Integration
1. **Update Header** - Fetch navigation from database
2. **Update Footer** - Fetch footer settings from database
3. **Update Index Page** - Use dynamic content
4. **Update All Pages** - Connect to respective collections

### Priority 4: Additional Features
1. **Rich Text Editor** - For content editing
2. **Image Optimization** - Compress uploaded images
3. **Drag & Drop** - Reorder cards and gallery items
4. **Search Functionality** - Search cards, gallery, etc.
5. **Export/Import** - Backup and restore data

---

## 🔧 API Endpoints Summary

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/login | Show login page |
| POST | /admin/login | Process login |
| GET | /admin/logout | Logout user |

### Cards
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /admin/cards | List all cards |
| GET | /admin/cards/create | Show create form |
| POST | /admin/cards/create | Create new card |
| GET | /admin/cards/edit/:id | Show edit form |
| POST | /admin/cards/update/:id | Update card |
| POST | /admin/cards/delete/:id | Delete card |
| POST | /admin/cards/toggle-status/:id | Toggle pause/resume |

---

## 🐛 Troubleshooting

### Issue: Cannot connect to MongoDB
**Solution:** 
- Verify MONGODB_URI is correct
- Check MongoDB whitelist includes your IP
- For Vercel, use 0.0.0.0/0 temporarily for testing

### Issue: Login fails
**Solution:**
- Run `npm run seed` to create admin user
- Check browser console for errors
- Clear cookies and try again

### Issue: File uploads not working
**Solution:**
- Ensure `public/uploads` directory exists
- Check file size limits (max 5MB)
- Verify file types are allowed (jpg, png, gif, webp)

---

## 📞 Support

For issues or questions:
1. Check the console logs for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB connection is working
4. Review the implementation plan document

---

**🎉 Congratulations!** Your admin panel foundation is ready. Start by running the seed script and logging in to test the card management features.
