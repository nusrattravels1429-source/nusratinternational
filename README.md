# Nusrat International - Travel & Hajj Services

A professional web application for Nusrat International, providing comprehensive travel and Hajj pilgrimage services. Built with Node.js, Express, and MongoDB for dynamic content management.

## 🚀 Features

- **Dynamic Content Management**: MongoDB-powered CMS for easy content updates
- **Responsive Design**: Mobile-first approach with modern CSS
- **Multi-language Support**: Bengali and English content
- **Service Pages**: Hajj, Travel, Work Visas, and Ticketing
- **Admin Panel**: Content management interface
- **RESTful API**: Backend API for content operations

## 🏗️ Project Structure

```
nusrat-international/
├── src/                    # Server-side code
│   ├── controllers/        # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── config/            # Configuration files
│   └── utils/             # Utility functions
├── public/                # Static assets
│   ├── css/              # Stylesheets
│   ├── js/               # Client-side JavaScript
│   ├── images/           # Static images
│   └── pages/            # HTML pages
├── uploads/              # User-uploaded content
├── docs/                 # Documentation
├── .env                  # Environment variables
├── .gitignore           # Git ignore rules
├── package.json         # Dependencies
├── README.md            # This file
└── server.js            # Main application entry
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: Custom CSS with responsive design
- **Deployment**: Ready for cloud deployment

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nusrat-international
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   - Copy `.env` and update MongoDB connection string
   - Set `MONGODB_URI` to your MongoDB instance

4. **Start the application**
   ```bash
   # Development mode
   npm run dev

   # Production mode
   npm start
   ```

5. **Access the application**
   - Website: http://localhost:3000
   - API: http://localhost:3000/api

## 📚 API Documentation

### Health Check
```http
GET /api/health
```

### Pages
```http
GET /api/pages/:slug          # Get page by slug
GET /api/pages                # Get all pages
POST /api/pages               # Create/update page (admin)
```

## 🔧 Configuration

Update the following in your `.env` file:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/nusrat_international
```

## 📁 Key Directories

- `src/` - Server-side application code
- `public/` - Static assets served to clients
- `uploads/` - Directory for user-uploaded files
- `docs/` - Database schemas and documentation

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is proprietary software for Nusrat International.

## 📞 Contact

Nusrat International
- Website: [Your website URL]
- Email: [Contact email]

---

**Built with ❤️ for exceptional travel experiences** 
