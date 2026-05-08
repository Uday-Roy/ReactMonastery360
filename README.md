# 🏛️ Monastery360 - Modern Monastery Booking Platform

### A Production-Ready MERN Stack Application with React, Node.js, Express, and MongoDB

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Status](https://img.shields.io/badge/status-active-green)
![License](https://img.shields.io/badge/license-MIT-success)

---

## 🌟 Overview

Monastery360 is a **modern, full-stack monastery booking platform** built with the latest technologies. It provides users with a seamless experience to discover, book, and review monasteries while offering administrators powerful tools to manage the platform.

### ✨ Key Features

**For Users:**

- ✅ Browse and search monasteries
- ✅ Detailed monastery information with photos and videos
- ✅ Secure booking system with Razorpay payments
- ✅ OTP-based email and SMS verification
- ✅ Social login (Google, GitHub)
- ✅ Guest access for quick browsing
- ✅ Review and rating system
- ✅ AI-powered trip planner
- ✅ Contact and support chat
- ✅ User dashboard with booking history
- ✅ Cookie consent management (GDPR compliant)

**For Administrators:**

- ✅ Comprehensive dashboard with analytics
- ✅ User management and role assignment
- ✅ Booking management and status updates
- ✅ Revenue reports and financial analytics
- ✅ Monastery statistics
- ✅ Secure admin panel with authentication
- ✅ Password management

---

## 🚀 Quick Start (5 Minutes)

### Prerequisites

- Node.js v16+
- MongoDB v4.4+
- npm or yarn

### Installation & Running

```bash
# 1. Initialize Database with Admin User
cd backend
npm install
npm run init-db

# 2. Start Backend (Terminal 1)
npm run dev
# ✅ Server running on http://localhost:5000

# 3. Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev
# ✅ Frontend running on http://localhost:5173
```

### 🔐 Default Credentials

**Admin Account:**

```
Email: admin@monastery360.local
Password: Admin@123456
```

**Test User:**

```
Email: user@monastery360.local
Password: User@123456
```

### 📍 Access Points

| Component   | URL                         | Purpose                 |
| ----------- | --------------------------- | ----------------------- |
| Main App    | http://localhost:5173       | User-facing application |
| Admin Panel | http://localhost:5173/admin | Admin dashboard         |
| API         | http://localhost:5000/api   | Backend API             |

---

## 📁 Project Structure

```
reactMonastery360/
├── backend/
│   ├── config/              # Configuration files
│   │   ├── db.js           # MongoDB connection
│   │   ├── mailer.js       # Email service
│   │   └── passport.js     # OAuth configuration
│   ├── controllers/         # Business logic
│   │   ├── authController.js
│   │   ├── adminController.js
│   │   ├── bookingController.js
│   │   └── ...
│   ├── models/             # Database schemas
│   │   ├── User.js
│   │   ├── Booking.js
│   │   ├── Monastery.js
│   │   └── ...
│   ├── routes/             # API endpoints
│   │   ├── authRoutes.js
│   │   ├── adminRoutes.js
│   │   └── ...
│   ├── middleware/         # Custom middleware
│   │   └── authMiddleware.js
│   ├── server.js          # Express app
│   ├── init-db.js         # Database initialization
│   └── .env               # Environment variables
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── CookieConsent.jsx
│   │   │   └── Notification.jsx
│   │   ├── pages/         # Page components
│   │   │   ├── Home.jsx
│   │   │   ├── Auth.jsx
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── Booking.jsx
│   │   │   └── ...
│   │   ├── store/         # Zustand stores
│   │   │   └── index.js
│   │   ├── utils/         # Utilities
│   │   │   └── api.js
│   │   ├── App.jsx        # Main app
│   │   └── main.jsx       # Entry point
│   ├── index.html
│   └── tailwind.config.js
├── QUICK_START.md              # Quick start guide
├── ADMIN_SETUP_GUIDE.md        # Detailed admin setup
└── PACKAGES_DOCUMENTATION.md   # Package explanations
```

---

## 🔧 Technology Stack

### Backend

| Technology     | Purpose              |
| -------------- | -------------------- |
| **Node.js**    | Runtime environment  |
| **Express**    | REST API framework   |
| **MongoDB**    | NoSQL database       |
| **Mongoose**   | MongoDB ODM          |
| **JWT**        | Token authentication |
| **Bcryptjs**   | Password hashing     |
| **Passport**   | OAuth authentication |
| **Nodemailer** | Email service        |
| **Razorpay**   | Payment gateway      |
| **Twilio**     | SMS service          |
| **OpenAI**     | AI features          |

### Frontend

| Technology       | Purpose             |
| ---------------- | ------------------- |
| **React**        | UI library          |
| **Vite**         | Build tool          |
| **Tailwind CSS** | Styling framework   |
| **Zustand**      | State management    |
| **Axios**        | HTTP client         |
| **React Router** | Client-side routing |

---

## 📊 Architecture

```
┌─────────────────────────────────┐
│   React Frontend (Port 5173)    │
│   - Zustand State Management    │
│   - Tailwind CSS Styling        │
│   - Axios HTTP Client           │
└─────────────┬───────────────────┘
              │ REST API
              │ JWT Auth
              ▼
┌─────────────────────────────────┐
│   Express Server (Port 5000)    │
│   - Mongoose ODM                │
│   - Passport Auth               │
│   - JWT Verification            │
│   - Email/SMS Services          │
└─────────────┬───────────────────┘
              │
              ▼
┌─────────────────────────────────┐
│   MongoDB Database              │
│   - Users                       │
│   - Monasteries                 │
│   - Bookings                    │
│   - Reviews                     │
│   - OTP Tokens                  │
└─────────────────────────────────┘

External Services:
├─ Google OAuth
├─ Razorpay Payments
├─ Twilio SMS
├─ OpenAI GPT-4
└─ Gmail/Nodemailer
```

---

## 🔐 Authentication System

### Login Flow

1. User enters email/password
2. Backend validates credentials
3. JWT token generated (7-day expiration)
4. Token stored in localStorage
5. User data stored in Zustand store
6. Subsequent requests include token in Authorization header

### Security Features

- ✅ Passwords hashed with bcryptjs (10 rounds)
- ✅ JWT tokens for stateless authentication
- ✅ CORS configured for cross-origin requests
- ✅ Environment variables for sensitive data
- ✅ Protected routes with role-based access
- ✅ Cookie consent for GDPR compliance

---

## 📱 API Endpoints

### Authentication

```
POST   /api/auth/signup              # User registration
POST   /api/auth/login               # User login
POST   /api/auth/social-login        # Social OAuth
POST   /api/auth/guest-access        # Guest session
POST   /api/auth/send-otp            # Send email OTP
POST   /api/auth/verify-otp          # Verify OTP
POST   /api/auth/send-otp-sms        # Send SMS OTP
POST   /api/auth/forgot-password     # Password reset request
POST   /api/auth/reset-password      # Reset password
GET    /api/auth/profile             # Get user profile
PUT    /api/auth/profile             # Update profile
```

### Admin Routes (Protected)

```
GET    /api/admin/dashboard          # Dashboard stats
GET    /api/admin/analytics          # Detailed analytics
GET    /api/admin/users              # All users
PUT    /api/admin/users/:id/role     # Change user role
DELETE /api/admin/users/:id          # Delete user
GET    /api/admin/bookings           # All bookings
PUT    /api/admin/bookings/:id/status # Update booking status
GET    /api/admin/revenue            # Revenue reports
GET    /api/admin/monasteries/stats  # Monastery analytics
PUT    /api/admin/password           # Change admin password
```

### Monasteries

```
GET    /api/monasteries              # List all
GET    /api/monasteries/:id          # Get details
POST   /api/monasteries              # Create (admin)
PUT    /api/monasteries/:id          # Update (admin)
DELETE /api/monasteries/:id          # Delete (admin)
```

### Bookings

```
GET    /api/bookings                 # User's bookings
POST   /api/bookings                 # Create booking
POST   /api/bookings/payment-booking # Create with payment
```

### Reviews

```
GET    /api/reviews                  # Get reviews by monastery
POST   /api/reviews                  # Create review
DELETE /api/reviews/:id              # Delete review
```

### Contact & AI

```
POST   /api/contact/message          # Contact form
POST   /api/contact/ai-chat          # AI chat
POST   /api/contact/trip-planner     # Trip planner
```

---

## 🗄️ Database Schema

### User Collection

```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: String (user|admin|editor),
  googleId: String,
  githubId: String,
  isGuest: Boolean,
  cookieConsent: Object,
  createdAt: Date,
  updatedAt: Date
}
```

### Booking Collection

```javascript
{
  user: ObjectId (ref: User),
  monastery: ObjectId (ref: Monastery),
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  totalAmount: Number,
  paymentStatus: String,
  bookingStatus: String,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Testing the Application

### 1. Admin Login

1. Go to http://localhost:5173/auth
2. Login with admin credentials
3. Navigate to http://localhost:5173/admin
4. Verify dashboard loads with stats

### 2. User Login

1. Login with test user credentials
2. Browse monasteries
3. Create a booking
4. Verify booking appears in dashboard

### 3. API Testing

```bash
# Health check
curl http://localhost:5000/

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@monastery360.local","password":"Admin@123456"}'
```

---

## 🚢 Deployment

### Environment Configuration

Create `.env` file with:

```env
MONGO_URI=mongodb+srv://...
JWT_SECRET=your-secret-key
NODE_ENV=production
PORT=5000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
RAZORPAY_KEY_ID=...
RAZORPAY_KEY_SECRET=...
OPENAI_API_KEY=...
MAIL_USER=...
MAIL_APP_PASSWORD=...
TWILIO_SID=...
TWILIO_AUTH=...
```

### Backend Deployment (Heroku)

```bash
heroku login
heroku create monastery360-api
git push heroku main
```

### Frontend Deployment (Vercel)

```bash
npm run build
vercel --prod
```

---

## 📚 Documentation

| Document                                                 | Purpose              |
| -------------------------------------------------------- | -------------------- |
| [QUICK_START.md](./QUICK_START.md)                       | 5-minute setup guide |
| [ADMIN_SETUP_GUIDE.md](./ADMIN_SETUP_GUIDE.md)           | Detailed admin guide |
| [PACKAGES_DOCUMENTATION.md](./PACKAGES_DOCUMENTATION.md) | Package explanations |

---

## 🐛 Troubleshooting

### Issue: Admin login fails

**Solution**: Run `npm run init-db` in backend directory

### Issue: MongoDB connection error

**Solution**: Ensure MongoDB is running on localhost:27017

### Issue: CORS errors

**Solution**: Verify backend runs on port 5000, frontend on 5173

### Issue: OTP not sending

**Solution**: Check .env has correct Gmail credentials

---

## 🔐 Security Checklist

- ✅ Passwords hashed with bcryptjs
- ✅ JWT tokens with expiration
- ✅ CORS configured
- ✅ Environment variables protected
- ✅ Password reset via OTP
- ✅ Role-based access control
- ✅ GDPR-compliant cookie consent
- ⏳ Rate limiting (can be added)
- ⏳ HTTPS (configure in production)
- ⏳ 2FA support (can be enhanced)

---

## 📈 Performance Features

- ✅ MongoDB indexing
- ✅ JWT caching
- ✅ Pagination support
- ✅ API rate limiting ready
- ✅ Lazy loading components
- ✅ Image optimization
- ✅ Code splitting with Vite

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 📞 Support & Contact

For issues, questions, or suggestions:

- 📧 Email: support@monastery360.local
- 🐛 GitHub Issues: [Create an issue](https://github.com/yourusername/monastery360/issues)
- 💬 Discussions: [Start a discussion](https://github.com/yourusername/monastery360/discussions)

---

## 🙏 Acknowledgments

- Built with ❤️ using modern web technologies
- Inspired by the need for digital monastery management
- Thanks to all contributors and supporters

---

## 🎯 Roadmap

### v1.1 (In Progress)

- [ ] Advanced search with filters
- [ ] Payment gateway optimization
- [ ] Mobile app (React Native)
- [ ] Video tour system

### v1.2 (Planned)

- [ ] Real-time notifications
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Integration with booking systems

---

**Version**: 1.0.0  
**Last Updated**: May 5, 2026  
**Status**: ✅ Production Ready

Happy booking! 🏛️✨ - React Version

🏔️ A modern MERN stack web application for exploring and booking sacred Buddhist monasteries in Sikkim, India.

## 📋 Project Overview

Monastery360 is a full-featured tourism platform built with:

- **Frontend**: React 18 + Tailwind CSS (Modern SaaS Design)
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Authentication**: JWT + Google OAuth
- **Payments**: Razorpay Integration
- **AI Features**: OpenAI ChatGPT Integration
- **Email Service**: Gmail SMTP

## 📁 Project Structure

```
reactMonastery360/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database & Auth configs
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth & error handling
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API routes
│   ├── server.js           # Main server file
│   ├── .env                # Environment variables
│   └── package.json        # Dependencies
│
└── frontend/               # React + Tailwind
    ├── src/
    │   ├── components/     # Reusable components
    │   ├── pages/          # Page components
    │   ├── store/          # Zustand state management
    │   ├── utils/          # API calls & helpers
    │   ├── App.jsx         # Main App component
    │   ├── main.jsx        # React entry point
    │   └── index.css       # Global styles
    ├── index.html          # HTML template
    ├── vite.config.js      # Vite configuration
    ├── tailwind.config.js  # Tailwind setup
    └── package.json        # Dependencies
```

## 🚀 Quick Start

### Backend Setup

```bash
# 1. Navigate to backend directory
cd reactMonastery360/backend

# 2. Install dependencies
npm install

# 3. Ensure MongoDB is running locally
mongod

# 4. Start the server
npm start

# Server runs on http://localhost:5000
```

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd reactMonastery360/frontend

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# Frontend runs on http://localhost:3000
```

## 🔧 Environment Configuration

Create `.env` file in `backend/` folder:

```env
# Database
MONGO_URI=mongodb://localhost:27017/NewMonastery360

# JWT
JWT_SECRET=monastery360_secure_auth_2026_🔥

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Email Service
MAIL_USER=your_gmail@gmail.com
MAIL_APP_PASSWORD=your_app_password
ADMIN_EMAIL=admin@monastery360.com

# Payment Gateway
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret

# AI Services
OPENAI_API_KEY=your_openai_api_key

# Server
PORT=5000
NODE_ENV=development
```

## ✨ Key Features

### 1. **Tourist Features**

- ✅ Browse all monasteries with filters
- ✅ View detailed monastery information
- ✅ Submit reviews and ratings
- ✅ Book monastery visits with Razorpay payment
- ✅ Email confirmations for bookings
- ✅ User dashboard with booking history

### 2. **AI Trip Planner** 🤖

- ✅ Chat with AI assistant about monasteries
- ✅ Get travel tips and cultural advice
- ✅ Generate customized trip itineraries
- ✅ Natural language trip planning

### 3. **Contact System** 📧

- ✅ Contact form with email delivery
- ✅ Messages sent to admin Gmail
- ✅ Automated confirmation emails to users
- ✅ Professional email templates

### 4. **Authentication**

- ✅ Email/password signup & login
- ✅ Google OAuth integration
- ✅ Guest access mode
- ✅ JWT token-based security
- ✅ OTP verification support

### 5. **Admin Panel**

- ✅ User management
- ✅ Booking analytics
- ✅ Content management
- ✅ Image uploads
- ✅ Dashboard statistics

## 🎨 UI/UX Features

- **Modern Dark Theme**: Professional dark mode design
- **Floating Animations**: Dynamic carousel with floating text
- **Responsive Design**: Mobile-first approach
- **Tailwind CSS**: Utility-first styling
- **Glassmorphism Effects**: Modern UI patterns
- **Smooth Transitions**: Animated components

## 📡 API Endpoints

### Authentication

- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/social-login` - Google/OAuth login
- `POST /api/auth/guest-access` - Guest session
- `POST /api/auth/send-otp` - Send OTP email
- `POST /api/auth/verify-otp` - Verify OTP

### Monasteries

- `GET /api/monasteries` - List all monasteries
- `GET /api/monasteries/:id` - Get monastery details
- `POST /api/monasteries` - Create monastery (admin)
- `PUT /api/monasteries/:id` - Update monastery
- `DELETE /api/monasteries/:id` - Delete monastery

### Bookings

- `GET /api/bookings` - Get user bookings
- `POST /api/bookings` - Create booking
- `POST /api/bookings/payment-booking` - Booking with payment
- `GET /api/bookings/admin/all` - All bookings (admin)

### Reviews

- `GET /api/reviews` - Get reviews for monastery
- `POST /api/reviews` - Submit review
- `DELETE /api/reviews/:id` - Delete review

### Contact & AI

- `POST /api/contact/message` - Send contact message
- `POST /api/contact/ai-chat` - Chat with AI
- `POST /api/contact/trip-planner` - Generate trip plan

### Payments

- `POST /api/payment/create-order` - Create Razorpay order
- `POST /api/payment/verify` - Verify payment

## 🛠️ Technology Stack

### Frontend

- React 18
- React Router v6
- Tailwind CSS
- Zustand (State Management)
- Axios (HTTP Client)
- Vite (Build Tool)

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Passport.js (OAuth)
- Razorpay
- OpenAI API
- Nodemailer
- Twilio (SMS)

## 📱 Responsive Breakpoints

- Mobile: 320px - 640px
- Tablet: 641px - 1024px
- Desktop: 1025px and above

## 🔒 Security Features

- Password hashing with bcryptjs
- JWT token authentication (7-day expiry)
- Protected routes with middleware
- CORS enabled
- Input validation
- SQL injection prevention (MongoDB)
- XSS protection

## 📊 Database Schema

### Collections

1. **Users** - User profiles and auth
2. **Monasteries** - Monastery information
3. **Bookings** - Booking records
4. **Reviews** - User reviews and ratings
5. **Images** - Carousel images
6. **Content** - CMS content
7. **OtpToken** - OTP records
8. **Testimonials** - User testimonials
9. **Amenities** - Nearby amenities

## 🧪 Testing

### Test Admin Account

- Email: admin@monastery360.com
- Password: admin@123

### Test Payment (Razorpay)

- Card: 4111 1111 1111 1111
- Expiry: 12/25
- CVV: 123

## 📈 Performance Optimization

- Lazy loading images
- Code splitting
- Minified CSS & JS
- Optimized bundle size
- Caching strategies
- Database indexing

## 🐛 Known Issues & Workarounds

None currently. If you encounter issues:

1. Clear browser cache and localStorage
2. Restart MongoDB service
3. Reinstall node_modules
4. Check .env configuration

## 🤝 Contributing

This is a production-ready application. For modifications:

1. Follow existing code structure
2. Use ES6+ syntax
3. Add comments for complex logic
4. Test thoroughly before deployment

## 📝 License

© 2026 Monastery360. All rights reserved.

## 👥 Support

For issues or questions:

- Email: udaykumarroynpg@gmail.com
- Check existing documentation files

---

**Last Updated**: May 2026
**Version**: 1.0.0 (React)
**Status**: ✅ Production Ready
# ReactMonastery360
