import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, ".env") });

// Import models
import User from "./models/User.js";

const initializeDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected for initialization");

    // Create admin user
    const adminEmail = "admin@monastery360.local";
    const adminPassword = "Admin@123456"; // Default password - user should change after first login

    const existingAdmin = await User.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists");
    } else {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      const adminUser = await User.create({
        name: "Administrator",
        email: adminEmail,
        password: hashedPassword,
        phone: "+91-0000-000000",
        role: "admin",
        cookieConsent: {
          analytics: true,
          marketing: false,
          accepted: true,
          acceptedAt: new Date(),
        },
      });

      console.log("✅ Admin user created successfully!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📧 Admin Email: " + adminEmail);
      console.log("🔐 Admin Password: " + adminPassword);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("⚠️  IMPORTANT: Change your password after first login!");
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    // Create sample test user
    const testUserEmail = "user@monastery360.local";
    const existingTestUser = await User.findOne({ email: testUserEmail });

    if (!existingTestUser) {
      const testPassword = "User@123456";
      const hashedPassword = await bcrypt.hash(testPassword, 10);

      await User.create({
        name: "Test User",
        email: testUserEmail,
        password: hashedPassword,
        phone: "+91-9999-999999",
        role: "user",
        cookieConsent: {
          analytics: true,
          marketing: false,
          accepted: true,
          acceptedAt: new Date(),
        },
      });

      console.log("✅ Test user created successfully!");
      console.log("📧 Test Email: " + testUserEmail);
      console.log("🔐 Test Password: " + testPassword);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }

    console.log("✅ Database initialization complete!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
};

initializeDatabase();
