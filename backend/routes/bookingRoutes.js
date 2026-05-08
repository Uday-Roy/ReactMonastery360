import express from "express";
import * as bookingController from "../controllers/bookingController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, bookingController.getMyBookings);
router.post("/", protect, bookingController.createBooking);
router.post("/payment-booking", bookingController.createPaymentBooking);

// Admin routes
router.get(
  "/admin/all",
  protect,
  allowRoles("admin"),
  bookingController.getAllBookings,
);
router.put(
  "/admin/:id/status",
  protect,
  allowRoles("admin"),
  bookingController.updateBookingStatus,
);

export default router;
