import mongoose from "mongoose";

const imageSchema = new mongoose.Schema(
  {
    title: String,
    url: { type: String, required: true },
    alt: String,
    section: { type: String, default: "carousel" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export default mongoose.model("Image", imageSchema);
