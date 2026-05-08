import User from "../models/User.js";
import OtpToken from "../models/OtpToken.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMail } from "../config/mailer.js";

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  isGuest: user.isGuest,
  profilePhoto: user.profilePhoto,
  cookieConsent: user.cookieConsent,
});

const makeOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export const signup = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    user = await User.create({
      name,
      email,
      phone,
      password: await bcrypt.hash(password, 10),
      role: "user",
    });

    res.json({
      msg: "Signup successful",
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ msg: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "User not found" });
    if (!user.password) {
      return res.status(400).json({ msg: "Use social login for this account" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    res.json({
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const socialLogin = async (req, res) => {
  const { name, email, provider, providerId } = req.body;

  if (!email || !provider) {
    return res.status(400).json({ msg: "Email and provider are required" });
  }

  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({
        name: name || `${provider} User`,
        email,
        provider,
        googleId: provider === "google" ? providerId : undefined,
        githubId: provider === "github" ? providerId : undefined,
        role: "user",
      });
    } else {
      user.name = user.name || name;
      user.provider = user.provider || provider;
      if (provider === "google") user.googleId = user.googleId || providerId;
      if (provider === "github") user.githubId = user.githubId || providerId;
      await user.save();
    }

    res.json({
      msg: "Social login successful",
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Social login error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const guestAccess = async (req, res) => {
  try {
    const suffix = `${Date.now()}${Math.floor(Math.random() * 10000)}`;
    const user = await User.create({
      name: "Guest Explorer",
      email: `guest_${suffix}@monastery360.local`,
      role: "guest",
      isGuest: true,
    });

    res.json({
      msg: "Guest session created",
      token: signToken(user._id),
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Guest access error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const sendOtp = async (req, res) => {
  const { email, purpose = "signup" } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    const otp = makeOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await OtpToken.findOneAndUpdate(
      { email, purpose },
      { otp, expiresAt, used: false },
      { upsert: true },
    );

    await sendMail({
      to: email,
      subject: "Monastery360 - OTP Verification",
      html: `
        <h2>Email Verification</h2>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 10 minutes.</p>
        <p>Do not share this OTP with anyone.</p>
      `,
    });

    res.json({ msg: "OTP sent successfully" });
  } catch (err) {
    console.error("OTP error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp, purpose = "signup" } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ msg: "Email and OTP are required" });
  }

  try {
    const token = await OtpToken.findOne({
      email,
      otp,
      purpose,
      used: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!token) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    token.used = true;
    await token.save();

    res.json({ msg: "OTP verified successfully" });
  } catch (err) {
    console.error("OTP verification error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ msg: "Email is required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    const otp = makeOtp();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    await OtpToken.findOneAndUpdate(
      { email, purpose: "password_reset" },
      { otp, expiresAt, used: false },
      { upsert: true },
    );

    await sendMail({
      to: email,
      subject: "Monastery360 - Password Reset",
      html: `
        <h2>Password Reset Request</h2>
        <p>We received a password reset request for your account.</p>
        <p>Your OTP is: <strong>${otp}</strong></p>
        <p>This OTP will expire in 15 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.json({ msg: "Password reset OTP sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res
      .status(400)
      .json({ msg: "Email, OTP, and new password are required" });
  }

  if (newPassword.length < 6) {
    return res
      .status(400)
      .json({ msg: "Password must be at least 6 characters" });
  }

  try {
    const token = await OtpToken.findOne({
      email,
      otp,
      purpose: "password_reset",
      used: false,
      expiresAt: { $gt: Date.now() },
    });

    if (!token) {
      return res.status(400).json({ msg: "Invalid or expired OTP" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "User not found" });
    }

    token.used = true;
    await token.save();

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password reset successfully" });
  } catch (err) {
    console.error("Reset password error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const sendOtpSms = async (req, res) => {
  const { phone, purpose = "signup" } = req.body;

  if (!phone) {
    return res.status(400).json({ msg: "Phone number is required" });
  }

  try {
    const otp = makeOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Save OTP in database
    await OtpToken.findOneAndUpdate(
      { phone, purpose },
      { otp, expiresAt, used: false },
      { upsert: true },
    );

    // Send SMS via Twilio (if configured)
    if (process.env.TWILIO_SID && process.env.TWILIO_AUTH) {
      // SMS sending logic would go here
      // For now, we'll just log it
      console.log(`SMS OTP to ${phone}: ${otp}`);
    }

    res.json({ msg: "OTP sent to phone number successfully" });
  } catch (err) {
    console.error("SMS OTP error:", err.message);
    res.status(500).json({ error: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { name, phone, profilePhoto } = req.body;

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;
    if (profilePhoto) updateData.profilePhoto = profilePhoto;

    const user = await User.findByIdAndUpdate(req.user._id, updateData, {
      new: true,
    }).select("-password");

    res.json({ msg: "Profile updated successfully", user: publicUser(user) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const { photoData } = req.body;

    if (!photoData) {
      return res.status(400).json({ msg: "Photo data is required" });
    }

    // Validate that it's a data URL
    if (!photoData.startsWith("data:image")) {
      return res.status(400).json({ msg: "Invalid image format" });
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { profilePhoto: photoData },
      { new: true },
    ).select("-password");

    res.json({
      msg: "Profile photo uploaded successfully",
      user: publicUser(user),
    });
  } catch (err) {
    console.error("Profile photo upload error:", err.message);
    res.status(500).json({ error: err.message });
  }
};
