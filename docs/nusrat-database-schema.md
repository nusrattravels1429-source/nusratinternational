# Nusrat International - MongoDB Database Schema

This document defines the MongoDB database structure to make your website fully dynamic. It handles **text**, **images**, **cards**, and **hyperlinks** without requiring code changes for content updates.

## 1. Image Upload Strategy
Since you need to upload images, we will store the **files on the server/cloud** and save the **metadata/paths** in MongoDB.

### Folder Structure (Server Side)
```text
/uploads
  /gallery      -> Images for the Gallery page
  /employees    -> Photos of staff members
  /packages     -> Hajj/Travel package cover images
  /certifications -> Certificate images
  /content      -> General images used in text sections
```

### Database Approach
- **File Storage**: Physical files stored in `/uploads` directory (or AWS S3/Cloudinary).
- **Database Storage**: MongoDB stores the `filename`, `path`, `url`, `alt_text`, and `category`.

---

## 2. Collections Schema

### A. `pages` Collection
Stores the structure of every page (Home, About, Hajj, etc.). This allows you to add new pages dynamically.

```json
{
  "_id": "ObjectId",
  "slug": "hajj-services", // URL identifier (e.g., domain.com/hajj-services)
  "title": "Hajj Services",
  "meta_description": "Best Hajj services...",
  "is_active": true,
  "sections": [
    {
      "section_id": "hero_section",
      "type": "hero", // hero, text_block, card_grid, gallery, contact_form
      "order": 1,
      "data": {
        "heading": "Perform Hajj with Peace of Mind",
        "sub_heading": "Complete guidance and support.",
        "background_image": "/uploads/content/hajj-bg.jpg"
      }
    },
    {
      "section_id": "info_block",
      "type": "text_block",
      "order": 2,
      "data": {
        "content": "<p>Detailed HTML content about Hajj...</p>",
        "image": "/uploads/content/hajj-info.jpg",
        "alignment": "left" // left, right, center
      }
    }
  ],
  "created_at": "ISODate",
  "updated_at": "ISODate"
}
```

### B. `media_library` Collection
Tracks all uploaded images. This prevents broken links and helps manage storage.

```json
{
  "_id": "ObjectId",
  "filename": "kaaba-view.jpg",
  "original_name": "kaaba_view_01.png",
  "path": "/uploads/packages/kaaba-view.jpg",
  "url": "https://nusrat-intl.com/uploads/packages/kaaba-view.jpg",
  "category": "package", // gallery, employee, package, certification, content
  "size_bytes": 245000,
  "mime_type": "image/jpeg",
  "alt_text": "View of Kaaba from hotel window",
  "uploaded_by": "admin_user_id",
  "uploaded_at": "ISODate"
}
```

### C. `packages` Collection
Specific schema for Hajj, Travel, and Work packages (dynamic cards).

```json
{
  "_id": "ObjectId",
  "type": "hajj", // hajj, travel, work
  "title": "Economy Hajj Package 2024",
  "slug": "economy-hajj-2024",
  "short_description": "Affordable 21-day package.",
  "full_description": "<p>Full details including visa, flight, and hotel info...</p>",
  "price": {
    "amount": 3500,
    "currency": "USD"
  },
  "duration_days": 21,
  "features": [
    "Visa Processing",
    "Return Flight",
    "5-Star Hotel",
    "Ziyarat Tours"
  ],
  "images": [
    {
      "url": "/uploads/packages/hajj-main.jpg",
      "caption": "Hotel View",
      "is_primary": true
    },
    {
      "url": "/uploads/packages/hajj-room.jpg",
      "caption": "Room Interior",
      "is_primary": false
    }
  ],
  "hyperlinks": [
    {
      "label": "Download Brochure",
      "url": "/downloads/brochure-hajj.pdf",
      "target": "_blank"
    },
    {
      "label": "Register Now",
      "url": "/contact?subject=hajj-registration",
      "target": "_self"
    }
  ],
  "is_featured": true,
  "is_active": true
}
```

### D. `employees` Collection
Dynamic management of team members.

```json
{
  "_id": "ObjectId",
  "name": "Ahmed Ali",
  "designation": "Senior Travel Consultant",
  "department": "Hajj & Umrah",
  "bio": "Over 10 years of experience in managing pilgrim groups.",
  "image": "/uploads/employees/ahmed-ali.jpg",
  "social_links": [
    { "platform": "linkedin", "url": "https://linkedin.com/in/ahmed" },
    { "platform": "email", "url": "mailto:ahmed@nusrat.com" }
  ],
  "order": 1,
  "is_active": true
}
```

### E. `certifications` Collection
For displaying licenses and awards dynamically.

```json
{
  "_id": "ObjectId",
  "title": "IATA Certified Agent",
  "issuing_authority": "IATA",
  "year_issued": 2022,
  "image": "/uploads/certifications/iata-cert.jpg",
  "verification_number": "123456789",
  "order": 1
}
```

### F. `gallery_items` Collection
For the dedicated Gallery page.

```json
{
  "_id": "ObjectId",
  "category": "hajj_trip_2023", // Group images into albums
  "title": "Group Photo at Mina",
  "image": "/uploads/gallery/mina-group.jpg",
  "thumbnail": "/uploads/gallery/thumbs/mina-group.jpg",
  "caption": "Our group performing rituals.",
  "taken_date": "ISODate",
  "order": 5
}
```

### G. `site_settings` Collection
Global dynamic data (Phone numbers, emails, social links, footer text).

```json
{
  "_id": "ObjectId",
  "key": "contact_info",
  "value": {
    "phone": "+1234567890",
    "email": "info@nusrat-intl.com",
    "address": "123 Main Street, City, Country",
    "whatsapp": "+1234567890"
  }
}
// Another document in same collection:
{
  "_id": "ObjectId",
  "key": "social_media",
  "value": {
    "facebook": "https://facebook.com/nusrat",
    "instagram": "https://instagram.com/nusrat",
    "twitter": "https://twitter.com/nusrat"
  }
}
```

### H. `navigation` Collection
Dynamic menu generation.

```json
{
  "_id": "ObjectId",
  "label": "Hajj Services",
  "link_type": "internal", // internal, external, anchor
  "url": "/hajj-services", // Matches slug in 'pages' collection
  "parent_id": null, // For dropdowns
  "order": 2,
  "is_visible": true
}
```

---

## 3. Implementation Logic (Node.js Example)

### How to Handle Image Uploads
When a user uploads an image via the Admin Panel:

1.  **Receive File**: Use `multer` middleware in Node.js.
2.  **Save File**: Move file to `/uploads/[category]/unique_filename.jpg`.
3.  **Generate Thumbnail**: Create a smaller version for faster loading.
4.  **Save to DB**: Insert record into `media_library` collection.
5.  **Return URL**: Send the URL back to the frontend to display immediately or save to another collection (like `packages`).

**Sample Mongoose Model for Media:**
```javascript
const mediaSchema = new mongoose.Schema({
  filename: String,
  path: String,
  category: {
    type: String,
    enum: ['gallery', 'employee', 'package', 'certification', 'content']
  },
  url: String,
  alt_text: String,
  size: Number,
  createdAt: { type: Date, default: Date.now }
});
```

## 4. Benefits of This Design

1.  **Fully Dynamic Content**: Change text, prices, and descriptions from an Admin Panel without touching code.
2.  **Dynamic Images**: Upload new photos for packages or employees, and they instantly appear on the site.
3.  **Flexible Cards**: Add new Hajj/Travel packages by simply filling a form; the frontend loops through the `packages` collection to render cards.
4.  **Managed Hyperlinks**: Update contact links or download buttons dynamically.
5.  **Scalable**: Easy to add new sections (e.g., "Testimonials") by adding a new section type to the `pages` schema.

## 5. Next Steps for You

1.  **Install Mongoose**: `npm install mongoose multer`
2.  **Create Models**: Convert the JSON schemas above into Mongoose models.
3.  **Build Admin API**: Create endpoints to:
    *   `POST /api/upload` (Handle image upload)
    *   `POST /api/packages` (Add new package)
    *   `PUT /api/pages/:slug` (Edit page content)
4.  **Update Frontend**: Replace static HTML text/images with API calls (using Fetch/Axios) to populate data from MongoDB.
