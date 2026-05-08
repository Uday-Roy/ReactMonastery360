import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", reviewController.getReviews);
router.post("/", protect, reviewController.createReview);
router.delete("/:id", protect, reviewController.deleteReview);

export default router;
