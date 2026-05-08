import mongoose from "mongoose";

const contentSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      enum: ["hero", "about", "testimonial", "footer", "contact", "settings"],
      required: true,
    },
    key: String,
    value: mongoose.Schema.Types.Mixed,
    type: {
      type: String,
      enum: ["text", "image", "url", "object", "array"],
      default: "text",
    },
    metadata: {
      alt: String,
      order: Number,
      isActive: { type: Boolean, default: true },
    },
  },
  { timestamps: true },
);

export default mongoose.model("Content", contentSchema);
