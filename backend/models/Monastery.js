import mongoose from "mongoose";

const monasterySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    region: { type: String, required: true },
    location: String,
    yearBuilt: Number,
    sect: String,
    history: String,
    timings: String,
    entry: String,
    image: String,
    rating: { type: Number, default: 0 },
    altitude: String,
    builtBy: String,
    significance: String,
    visitors: String,
    lat: Number,
    lng: Number,
    amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: "Amenity" }],
    transportation: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Transportation" },
    ],
  },
  { timestamps: true },
);

export default mongoose.model("Monastery", monasterySchema);
