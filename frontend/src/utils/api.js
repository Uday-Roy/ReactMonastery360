import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth endpoints
export const authAPI = {
  signup: (data) => api.post("/auth/signup", data),
  login: (data) => api.post("/auth/login", data),
  socialLogin: (data) => api.post("/auth/social-login", data),
  guestAccess: () => api.post("/auth/guest-access"),
  sendOtp: (email) => api.post("/auth/send-otp", { email }),
  verifyOtp: (email, otp) => api.post("/auth/verify-otp", { email, otp }),
  sendOtpSms: (phone) => api.post("/auth/send-otp-sms", { phone }),
  forgotPassword: (email) => api.post("/auth/forgot-password", { email }),
  resetPassword: (email, otp, newPassword) =>
    api.post("/auth/reset-password", { email, otp, newPassword }),
  getProfile: () => api.get("/auth/profile"),
  updateProfile: (data) => api.put("/auth/profile", data),
};

// Monastery endpoints
export const monasteryAPI = {
  getAll: (params) => api.get("/monasteries", { params }),
  getById: (id) => api.get(`/monasteries/${id}`),
  create: (data) => api.post("/monasteries", data),
  update: (id, data) => api.put(`/monasteries/${id}`, data),
  delete: (id) => api.delete(`/monasteries/${id}`),
};

// Booking endpoints
export const bookingAPI = {
  getMyBookings: () => api.get("/bookings"),
  create: (data) => api.post("/bookings", data),
  createPayment: (data) => api.post("/bookings/payment-booking", data),
  getAllAdmin: () => api.get("/bookings/admin/all"),
  updateStatus: (id, status) =>
    api.put(`/bookings/admin/${id}/status`, { status }),
};

// Review endpoints
export const reviewAPI = {
  getByMonastery: (monasteryId) =>
    api.get("/reviews", { params: { monasteryId } }),
  create: (data) => api.post("/reviews", data),
  delete: (id) => api.delete(`/reviews/${id}`),
};

// Contact endpoints
export const contactAPI = {
  sendMessage: (data) => api.post("/contact/message", data),
  aiChat: (message, reset) => api.post("/contact/ai-chat", { message, reset }),
  generateTripPlan: (data) => api.post("/contact/trip-planner", data),
};

// Payment endpoints
export const paymentAPI = {
  createOrder: (amount, currency) =>
    api.post("/payment/create-order", { amount, currency }),
  verifyPayment: (data) => api.post("/payment/verify", data),
};

// Image endpoints
export const imageAPI = {
  getAll: (params) => api.get("/images", { params }),
  create: (data) => api.post("/images", data),
  update: (id, data) => api.put(`/images/${id}`, data),
  delete: (id) => api.delete(`/images/${id}`),
};

// Admin endpoints
export const adminAPI = {
  getDashboard: () => api.get("/admin/dashboard"),
  getAnalytics: () => api.get("/admin/analytics"),
  getUsers: () => api.get("/admin/users"),
  updateUserRole: (id, role) => api.put(`/admin/users/${id}/role`, { role }),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  getBookings: (params) => api.get("/admin/bookings", { params }),
  getRecentBookings: () => api.get("/admin/bookings/recent"),
  updateBookingStatus: (id, data) =>
    api.put(`/admin/bookings/${id}/status`, data),
  getRevenueReport: (params) => api.get("/admin/revenue", { params }),
  getMonasteryStats: () => api.get("/admin/monasteries/stats"),
  changePassword: (data) => api.put("/admin/password", data),
};

export default api;
