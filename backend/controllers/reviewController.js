import Review from "../models/Review.js";
import Monastery from "../models/Monastery.js";

export const getReviews = async (req, res) => {
  try {
    const { monasteryId } = req.query;
    let query = {};

    if (monasteryId) query.monastery = monasteryId;

    const reviews = await Review.find(query)
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createReview = async (req, res) => {
  try {
    const { monastery, rating, comment } = req.body;

    if (!monastery || !rating || !comment) {
      return res
        .status(400)
        .json({ msg: "Monastery, rating, and comment are required" });
    }

    // Check if user already reviewed this monastery
    const existingReview = await Review.findOne({
      user: req.user._id,
      monastery,
    });

    if (existingReview) {
      return res
        .status(400)
        .json({ msg: "You already reviewed this monastery" });
    }

    const review = await Review.create({
      user: req.user._id,
      monastery,
      rating,
      comment,
    });

    // Update monastery rating
    const reviews = await Review.find({ monastery });
    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

    await Monastery.findByIdAndUpdate(monastery, { rating: avgRating });

    res.status(201).json(await review.populate("user", "name email"));
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ msg: "Review not found" });
    }

    if (
      review.user.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ msg: "Permission denied" });
    }

    const monastery = review.monastery;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate monastery rating
    const reviews = await Review.find({ monastery });
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        : 0;

    await Monastery.findByIdAndUpdate(monastery, { rating: avgRating });

    res.json({ msg: "Review deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
