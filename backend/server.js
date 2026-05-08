import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import passport from "passport";

import { connectDB } from "./config/db.js";
import "./config/passport.js";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

// Initialize Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connect to MongoDB
await connectDB();

// Initialize Passport
app.use(passport.initialize());

// Import Routes
import authRoutes from "./routes/authRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import monasteryRoutes from "./routes/monasteryRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import imageRoutes from "./routes/imageRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import paymentRoutes from "./routes/payment.js";

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/monasteries", monasteryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/images", imageRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payment", paymentRoutes);

// Google OAuth routes
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    const qs = new URLSearchParams({
      token,
      name: req.user.name || "Google User",
      email: req.user.email || "",
      role: req.user.role || "user",
    });

    res.redirect(`http://localhost:3000/?${qs.toString()}`);
  },
);

// Health check
app.get("/", (req, res) => {
  res.json({
    status: "✅ Monastery360 API Running",
    version: "1.0.0 (React)",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Error:", err.message);
  res.status(err.status || 500).json({
    error: err.message,
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🏛️  Monastery360 Backend Server`);
  console.log(`📡 Running on PORT ${PORT}`);
  console.log(`🔐 JWT configured: ${!!process.env.JWT_SECRET}`);
  console.log(
    `📧 Email service: ${process.env.MAIL_USER ? "✅ Configured" : "⚠️  Not configured"}`,
  );
  console.log(
    `🤖 OpenAI API: ${process.env.OPENAI_API_KEY ? "✅ Configured" : "⚠️  Not configured"}`,
  );
  console.log(`\n📚 API Docs:`);
  console.log(`   GET  /api/monasteries       - List all monasteries`);
  console.log(`   POST /api/contact           - Send contact message`);
  console.log(`   POST /api/auth/signup       - User signup`);
  console.log(`   POST /api/auth/login        - User login`);
  console.log(`   POST /api/bookings          - Create booking`);
  console.log(`   POST /api/reviews           - Add review`);
  console.log(`   POST /api/ai/chat           - AI Chat Assistant\n`);
});

export default app;
