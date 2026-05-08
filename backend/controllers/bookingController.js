import Booking from "../models/Booking.js";
import { sendMail } from "../config/mailer.js";

export const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("monastery")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create({
      ...req.body,
      user: req.user._id,
      status: "pending",
    });

    // Send confirmation email
    await sendMail({
      to: req.user.email,
      subject: "🏔️ Booking Confirmation - Monastery360",
      html: `
        <h2>Booking Confirmed!</h2>
        <p>Thank you for booking with Monastery360.</p>
        <p><strong>Booking Reference:</strong> ${booking._id}</p>
        <p><strong>Plan:</strong> ${booking.plan}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
        <p><strong>Guests:</strong> ${booking.guests}</p>
        <p><strong>Amount:</strong> ₹${booking.amount}</p>
        <p>We will confirm your booking shortly.</p>
      `,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const createPaymentBooking = async (req, res) => {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      plan,
      date,
      guests,
      amount,
      gst,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
    } = req.body;

    if (
      !customerName ||
      !customerEmail ||
      !plan ||
      !date ||
      !guests ||
      !amount
    ) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const booking = await Booking.create({
      customerName,
      customerEmail,
      customerPhone,
      plan,
      date,
      guests,
      amount,
      gst: gst || 0,
      paymentMethod,
      razorpayOrderId,
      razorpayPaymentId,
      status: razorpayPaymentId ? "confirmed" : "pending",
      user: req.user ? req.user._id : null,
      monastery: null,
    });

    // Send confirmation email
    await sendMail({
      to: customerEmail,
      subject: "🏔️ Your Monastery360 Booking is Confirmed!",
      html: `
        <h2>Welcome to Monastery360!</h2>
        <p>Dear ${customerName},</p>
        <p>Your booking has been confirmed.</p>
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li><strong>Reference ID:</strong> ${booking._id}</li>
          <li><strong>Plan:</strong> ${plan}</li>
          <li><strong>Date:</strong> ${date}</li>
          <li><strong>Guests:</strong> ${guests}</li>
          <li><strong>Total Amount:</strong> ₹${amount}</li>
        </ul>
        <p>Please keep this reference ID for future communication.</p>
        <p>For any queries, contact us at ${process.env.ADMIN_EMAIL}</p>
      `,
    });

    res.status(201).json({
      success: true,
      booking,
      message: "Booking created successfully!",
    });
  } catch (error) {
    console.error("Booking error:", error);
    res.status(400).json({ error: error.message });
  }
};

export const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("user")
      .populate("monastery")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateBookingStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );

    if (!booking) {
      return res.status(404).json({ error: "Booking not found" });
    }

    res.json(booking);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
