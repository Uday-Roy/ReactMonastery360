# Monastery360 Backend API Documentation

## 🚀 Server Startup

### Prerequisites

- Node.js 16+
- MongoDB running locally on port 27017
- Environment variables configured in `.env`

### Installation

```bash
cd reactMonastery360/backend
npm install
npm start
```

Server runs on `http://localhost:5000`

## 📚 API Reference

### Authentication Endpoints

#### Signup

```http
POST /api/auth/signup
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "9876543210"
}

Response:
{
  "msg": "Signup successful",
  "token": "eyJhbGc...",
  "user": {
    "id": "6...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user"
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Guest Access

```http
POST /api/auth/guest-access
```

#### Send OTP

```http
POST /api/auth/send-otp
Content-Type: application/json

{
  "email": "john@example.com",
  "purpose": "signup"
}
```

### Monastery Endpoints

#### Get All Monasteries

```http
GET /api/monasteries?region=West&sort=-rating
Authorization: Bearer token (optional)
```

#### Get Single Monastery

```http
GET /api/monasteries/6...
```

#### Create Monastery (Admin)

```http
POST /api/monasteries
Authorization: Bearer token
Content-Type: application/json

{
  "name": "Pemayangtse Monastery",
  "region": "West",
  "location": "Pelling, Sikkim",
  "yearBuilt": 1705,
  "sect": "Nyingma",
  "history": "...",
  "image": "url"
}
```

### Booking Endpoints

#### Get My Bookings

```http
GET /api/bookings
Authorization: Bearer token
```

#### Create Booking

```http
POST /api/bookings
Authorization: Bearer token
Content-Type: application/json

{
  "monastery": "6...",
  "plan": "2-day visit",
  "date": "2026-05-15",
  "guests": 2,
  "amount": 5000
}
```

#### Create Payment Booking

```http
POST /api/bookings/payment-booking
Content-Type: application/json

{
  "customerName": "John Doe",
  "customerEmail": "john@example.com",
  "customerPhone": "9876543210",
  "plan": "3-day package",
  "date": "2026-05-15",
  "guests": 2,
  "amount": 7500,
  "gst": 1350,
  "paymentMethod": "Razorpay",
  "razorpayOrderId": "order_...",
  "razorpayPaymentId": "pay_..."
}
```

### Review Endpoints

#### Get Reviews

```http
GET /api/reviews?monasteryId=6...
```

#### Create Review

```http
POST /api/reviews
Authorization: Bearer token
Content-Type: application/json

{
  "monastery": "6...",
  "rating": 5,
  "comment": "Amazing spiritual experience!"
}
```

### Contact & AI Endpoints

#### Send Contact Message

```http
POST /api/contact/message
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Tour Inquiry",
  "message": "I'd like to know more about..."
}

Response:
{
  "msg": "Message sent successfully!",
  "status": "success"
}
```

#### AI Chat

```http
POST /api/contact/ai-chat
Content-Type: application/json

{
  "message": "What's the best time to visit monasteries?",
  "reset": false
}

Response:
{
  "msg": "Response generated",
  "response": "The best time to visit Sikkim monasteries...",
  "chatHistory": [...]
}
```

#### Trip Planner

```http
POST /api/contact/trip-planner
Content-Type: application/json

{
  "monasteries": ["Pemayangtse", "Enchey"],
  "days": 3,
  "interests": ["spirituality", "trekking"]
}

Response:
{
  "msg": "Trip plan generated",
  "tripPlan": "Day 1: Arrive at Pemayangtse..."
}
```

### Payment Endpoints

#### Create Payment Order

```http
POST /api/payment/create-order
Content-Type: application/json

{
  "amount": 5000,
  "currency": "INR",
  "receipt": "booking_123"
}

Response:
{
  "id": "order_...",
  "entity": "order",
  "amount": 500000,
  "amount_paid": 0
}
```

#### Verify Payment

```http
POST /api/payment/verify
Content-Type: application/json

{
  "razorpay_order_id": "order_...",
  "razorpay_payment_id": "pay_...",
  "razorpay_signature": "sig_..."
}
```

## 🔐 Authentication

All protected endpoints require:

```
Authorization: Bearer <JWT_TOKEN>
```

Tokens are valid for 7 days.

## ❌ Error Responses

```json
{
  "error": "Error message",
  "msg": "Optional message",
  "timestamp": "2026-05-04T12:34:56.789Z"
}
```

Common HTTP Status Codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## 📊 Database Collections

### User Schema

```
{
  _id: ObjectId,
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  role: "guest" | "user" | "editor" | "admin",
  cookieConsent: Object,
  isGuest: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Monastery Schema

```
{
  _id: ObjectId,
  name: String,
  region: String,
  location: String,
  yearBuilt: Number,
  sect: String,
  history: String,
  image: String,
  rating: Number,
  amenities: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing with cURL

```bash
# Test API health
curl http://localhost:5000/

# Signup
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@example.com","password":"pass123"}'

# Get monasteries
curl http://localhost:5000/api/monasteries

# Send contact message
curl -X POST http://localhost:5000/api/contact/message \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","message":"Hello"}'
```

## 📝 Environment Variables Explained

| Variable             | Purpose             | Example                                   |
| -------------------- | ------------------- | ----------------------------------------- |
| MONGO_URI            | MongoDB connection  | mongodb://localhost:27017/NewMonastery360 |
| JWT_SECRET           | Token signing key   | monastery360_secure_auth                  |
| GOOGLE_CLIENT_ID     | Google OAuth ID     | 327774638585...apps.googleusercontent.com |
| GOOGLE_CLIENT_SECRET | Google OAuth secret | GOCSPX-...                                |
| MAIL_USER            | Gmail address       | udaykumarroynpg@gmail.com                 |
| MAIL_APP_PASSWORD    | Gmail app password  | Uday@192005                               |
| ADMIN_EMAIL          | Admin email address | admin@monastery360.com                    |
| RAZORPAY_KEY_ID      | Razorpay public key | rzp*test*...                              |
| RAZORPAY_KEY_SECRET  | Razorpay secret key | Xg6tZjz4...                               |
| OPENAI_API_KEY       | OpenAI API key      | sk-proj-...                               |
| PORT                 | Server port         | 5000                                      |
| NODE_ENV             | Environment         | development                               |

## 🚀 Deployment

For production deployment:

1. Update environment variables
2. Set NODE_ENV=production
3. Use production MongoDB URL
4. Enable HTTPS
5. Configure CORS properly
6. Set up SSL certificates
7. Use process manager (PM2)

---

**API Version**: 1.0.0
**Last Updated**: May 2026
