import mongoose from "mongoose";

const amenitySchema = new mongoose.Schema(
  {
    monastery: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Monastery",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "restaurant",
        "hotel",
        "shop",
        "travel",
        "grocery",
        "hospital",
        "atm",
      ],
      required: true,
    },
    name: { type: String, required: true },
    description: String,
    distance: Number,
    rating: { type: Number, default: 0 },
    phone: String,
    address: String,
    website: String,
    openingHours: String,
    priceRange: {
      type: String,
      enum: ["budget", "moderate", "premium"],
      default: "moderate",
    },
    cuisineType: String,
    hotelType: String,
    image: String,
    reviews: [
      {
        user: String,
        rating: Number,
        comment: String,
        date: { type: Date, default: Date.now },
      },
    ],
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: [Number],
    },
  },
  { timestamps: true },
);

amenitySchema.index({ location: "2dsphere" });

export default mongoose.model("Amenity", amenitySchema);
