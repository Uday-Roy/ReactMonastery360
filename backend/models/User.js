import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: String,
    phone: String,
    googleId: String,
    githubId: String,
    provider: String,
    role: {
      type: String,
      enum: ["guest", "user", "editor", "admin"],
      default: "user",
    },
    cookieConsent: {
      analytics: { type: Boolean, default: false },
      marketing: { type: Boolean, default: false },
      accepted: { type: Boolean, default: false },
      acceptedAt: Date,
    },
    isGuest: { type: Boolean, default: false },
    profilePhoto: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
