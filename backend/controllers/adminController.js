import User from "../models/User.js";
import Booking from "../models/Booking.js";
import Monastery from "../models/Monastery.js";
import Review from "../models/Review.js";
import bcrypt from "bcryptjs";
import { sendMail } from "../config/mailer.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const totalMonasteries = await Monastery.countDocuments();
    const totalReviews = await Review.countDocuments();

    // Get revenue data
    const totalRevenue = await Booking.aggregate([
      { $match: { paymentStatus: "completed" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    // Get bookings by status
    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: "$bookingStatus", count: { $sum: 1 } } },
    ]);

    // Get recent activity
    const recentBookings = await Booking.find()
      .populate("user", "name email")
      .populate("monastery", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const recentUsers = await User.find()
      .select("-password")
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      stats: {
        totalUsers,
        totalBookings,
        totalMonasteries,
        totalReviews,
        totalRevenue: totalRevenue[0]?.total || 0,
      },
      bookingsByStatus,
      recentBookings,
      recentUsers,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!["user", "editor", "admin"].includes(role)) {
      return res.status(400).json({ msg: "Invalid role" });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true },
    ).select("-password");

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getRecentBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user", "name email")
      .populate("monastery", "name region")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getMonasteryStats = async (req, res) => {
  try {
    const stats = await Monastery.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "monastery",
          as: "bookings",
        },
      },
      {
        $lookup: {
          from: "reviews",
          localField: "_id",
          foreignField: "monastery",
          as: "reviews",
        },
      },
      {
        $project: {
          name: 1,
          region: 1,
          rating: 1,
          totalBookings: { $size: "$bookings" },
          totalReviews: { $size: "$reviews" },
          averageRating: { $avg: "$reviews.rating" },
        },
      },
      { $sort: { totalBookings: -1 } },
    ]);

    res.json(stats);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete user (admin only)
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    if (id === req.user._id.toString()) {
      return res.status(400).json({ msg: "Cannot delete yourself" });
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update booking status (admin only)
export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bookingStatus, paymentStatus } = req.body;

    const validStatuses = ["confirmed", "cancelled", "completed"];
    const validPaymentStatuses = ["pending", "completed", "failed"];

    if (bookingStatus && !validStatuses.includes(bookingStatus)) {
      return res.status(400).json({ msg: "Invalid booking status" });
    }

    if (paymentStatus && !validPaymentStatuses.includes(paymentStatus)) {
      return res.status(400).json({ msg: "Invalid payment status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { bookingStatus, paymentStatus },
      { new: true },
    ).populate("user", "name email");

    if (!booking) {
      return res.status(404).json({ msg: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all bookings (admin)
export const getAllBookings = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const query = {};
    if (status) query.bookingStatus = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;

    const bookings = await Booking.find(query)
      .populate("user", "name email phone")
      .populate("monastery", "name region")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await Booking.countDocuments(query);

    res.json({
      bookings,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        currentPage: parseInt(page),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get revenue report (admin)
export const getRevenueReport = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const query = { paymentStatus: "completed" };

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    const revenueData = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          revenue: { $sum: "$totalAmount" },
          bookings: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
    ]);

    const summary = await Booking.aggregate([
      { $match: query },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$totalAmount" },
          totalBookings: { $sum: 1 },
          averageBooking: { $avg: "$totalAmount" },
        },
      },
    ]);

    res.json({
      summary: summary[0] || {},
      daily: revenueData,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Change admin password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ msg: "Current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ msg: "Password must be at least 6 characters" });
    }

    const user = await User.findById(req.user._id);

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Current password is incorrect" });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    await user.save();

    res.json({ msg: "Password changed successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get system analytics (admin)
export const getAnalytics = async (req, res) => {
  try {
    // Monthly user growth
    const userGrowth = await User.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: -1 } },
      { $limit: 12 },
    ]);

    // Top monasteries by rating
    const topMonasteries = await Monastery.find()
      .sort({ rating: -1 })
      .limit(10);

    // Most recent reviews
    const recentReviews = await Review.find()
      .populate("user", "name")
      .populate("monastery", "name")
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      userGrowth,
      topMonasteries,
      recentReviews,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
