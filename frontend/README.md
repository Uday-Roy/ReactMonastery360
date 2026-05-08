# Frontend Documentation

## 📦 Installation & Setup

### Prerequisites

- Node.js 16+
- npm or yarn

### Quick Start

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000`

## 📁 Project Structure

```
src/
├── components/          # Reusable components
│   ├── Header.jsx      # Navigation bar
│   ├── Footer.jsx      # Footer component
│   └── Notification.jsx # Toast notifications
│
├── pages/              # Page components
│   ├── Home.jsx        # Landing page with carousel
│   ├── Monasteries.jsx # Monasteries listing
│   ├── MonasteryDetail.jsx
│   ├── Booking.jsx
│   ├── Contact.jsx
│   ├── Auth.jsx        # Login/Signup
│   ├── Dashboard.jsx
│   └── AdminPanel.jsx
│
├── store/              # State management (Zustand)
│   └── index.js        # Auth, Monastery, Booking stores
│
├── utils/
│   └── api.js          # API calls
│
├── App.jsx             # Main app component
├── main.jsx            # React entry point
└── index.css           # Global styles
```

## 🎨 Components

### Header

Navigation bar with:

- Logo
- Navigation links
- User dropdown
- Login/Logout buttons

### Home Page

Features:

- Hero section with floating animation
- Featured monastery carousel (3-second auto-play)
- AI chat assistant section
- Monasteries grid
- Call-to-action buttons

### Contact Page

- Contact form with validation
- Email submission
- Confirmation messages
- Shows admin email

### Auth Pages

- Signup form
- Login form
- Guest access option
- Form validation

## 🔄 State Management

Using Zustand for lightweight state:

```javascript
// Auth Store
const { user, isAuthenticated, setAuth, logout } = useAuthStore();

// Monastery Store
const { monasteries, selectedMonastery, setMonasteries } = useMonasteryStore();

// Booking Store
const { bookings, currentBooking, addBooking } = useBookingStore();

// UI Store
const { notification, showNotification } = useUIStore();
```

## 🎯 API Integration

### Making API Calls

```javascript
import { monasteryAPI, contactAPI } from "../utils/api";

// Get monasteries
const response = await monasteryAPI.getAll({ region: "West" });

// Send contact message
await contactAPI.sendMessage({
  name: "John",
  email: "john@example.com",
  message: "Hello",
});

// AI Chat
await contactAPI.aiChat("Tell me about monasteries");
```

## 🎨 Styling with Tailwind

Custom Tailwind extensions:

```css
/* Colors */
primary: #2c3e50
secondary: #e67e22
accent: #f39c12

/* Animations */
@keyframes float
@keyframes fadeInUp
@keyframes slideIn

/* Classes */
.btn-primary
.btn-secondary
.card
.card-hover
.glass
```

## 📱 Responsive Design

- **Mobile First**: Base styles for mobile
- **Breakpoints**:
  - `sm`: 640px
  - `md`: 768px
  - `lg`: 1024px
  - `xl`: 1280px

## 🌟 Key Features

### 1. Carousel with Floating Text

Home page features an auto-rotating carousel with:

- Floating text animation
- 3-second auto-play
- Manual navigation arrows
- Gradient overlay

```jsx
{
  /* Floating animation */
}
<div className="carousel-floating-text float">
  <h1>Monastery360</h1>
  <p>Discover Sacred Paths in Sikkim</p>
</div>;
```

### 2. AI Assistant Integration

- Chat interface for monastery queries
- Real-time responses from ChatGPT
- Chat history management
- Error handling

### 3. Contact Form

- Email delivery to admin
- Client-side validation
- Success/error notifications
- Accessible form inputs

### 4. Authentication Flow

```
1. User signs up/logs in
2. JWT token received
3. Token stored in localStorage
4. Added to all API requests
5. Protected routes check auth
```

### 5. Admin Panel

Accessible only to admin role users:

- User management
- Booking statistics
- Content management
- Analytics dashboard

## 🔒 Security

- JWT tokens in localStorage
- Authorization headers on protected requests
- Input validation on forms
- XSS prevention with React escaping
- CORS configured on backend

## 🧪 Build & Deployment

### Development

```bash
npm run dev
```

### Production Build

```bash
npm run build
# Creates optimized dist/ folder
```

### Preview Build

```bash
npm run preview
```

## 🐛 Troubleshooting

| Issue                  | Solution                             |
| ---------------------- | ------------------------------------ |
| API not connecting     | Check backend is running on 5000     |
| Style not loading      | Rebuild Tailwind: `npm run build`    |
| Images not showing     | Check image URLs in API              |
| Login not working      | Verify .env variables match backend  |
| AI chat not responding | Check OPENAI_API_KEY in backend .env |

## 📊 Performance Tips

- Use React DevTools Profiler
- Optimize image sizes
- Lazy load components
- Code splitting enabled by default (Vite)
- CSS is minified in production

## 🔗 Important Files

- `vite.config.js` - Build configuration
- `tailwind.config.js` - Tailwind customization
- `App.jsx` - Main routing
- `utils/api.js` - All API endpoints

## 📖 Additional Resources

- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com)
- [Vite Guide](https://vitejs.dev)
- [Zustand](https://github.com/pmndrs/zustand)

---

**Version**: 1.0.0
**Last Updated**: May 2026
