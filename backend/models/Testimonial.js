import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: String,
    rating: {
      type: Number,
      min: 1,
      max: 5,
      default: 5,
    },
    text: {
      type: String,
      required: true,
    },
    monastery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monastery",
    },
    isApproved: {
      type: Boolean,
      default: true,
    },
    image: String,
  },
  { timestamps: true },
);

export default mongoose.model("Testimonial", testimonialSchema);
