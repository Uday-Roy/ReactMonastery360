import express from "express";
import * as adminController from "../controllers/adminController.js";
import { protect, allowRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// Dashboard and Analytics
router.get(
  "/dashboard",
  protect,
  allowRoles("admin"),
  adminController.getAdminDashboard,
);

router.get(
  "/analytics",
  protect,
  allowRoles("admin"),
  adminController.getAnalytics,
);

// User Management
router.get("/users", protect, allowRoles("admin"), adminController.getAllUsers);

router.put(
  "/users/:id/role",
  protect,
  allowRoles("admin"),
  adminController.updateUserRole,
);

router.delete(
  "/users/:id",
  protect,
  allowRoles("admin"),
  adminController.deleteUser,
);

// Booking Management
router.get(
  "/bookings",
  protect,
  allowRoles("admin"),
  adminController.getAllBookings,
);

router.get(
  "/bookings/recent",
  protect,
  allowRoles("admin"),
  adminController.getRecentBookings,
);

router.put(
  "/bookings/:id/status",
  protect,
  allowRoles("admin"),
  adminController.updateBookingStatus,
);

// Revenue and Reports
router.get(
  "/revenue",
  protect,
  allowRoles("admin"),
  adminController.getRevenueReport,
);

// Monastery Stats
router.get(
  "/monasteries/stats",
  protect,
  allowRoles("admin"),
  adminController.getMonasteryStats,
);

// Admin Profile Management
router.put(
  "/password",
  protect,
  allowRoles("admin"),
  adminController.changePassword,
);

export default router;
