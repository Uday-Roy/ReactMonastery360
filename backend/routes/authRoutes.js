import express from "express";
import * as authController from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Authentication Routes
router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/social-login", authController.socialLogin);
router.post("/guest-access", authController.guestAccess);

// OTP Routes
router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/send-otp-sms", authController.sendOtpSms);

// Password Reset Routes
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Profile Routes (Protected)
router.get("/profile", protect, authController.getProfile);
router.put("/profile", protect, authController.updateProfile);
router.post(
  "/upload-profile-photo",
  protect,
  authController.uploadProfilePhoto,
);

export default router;
