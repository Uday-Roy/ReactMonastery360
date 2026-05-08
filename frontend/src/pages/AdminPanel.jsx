import React, { useState, useEffect } from "react";
import { useAuthStore, useUIStore } from "../store/index";
import { adminAPI } from "../utils/api";

export default function AdminPanel() {
  const { user } = useAuthStore();
  const { showNotification } = useUIStore();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [changePasswordMode, setChangePasswordMode] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });

  // Check admin access
  if (user?.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-900 pt-24 px-4 flex items-center justify-center">
        <div className="card">
          <p className="text-red-500 text-lg">
            ❌ You don't have admin access.
          </p>
          <p className="text-gray-400 mt-2">
            Only administrators can access this panel.
          </p>
        </div>
      </div>
    );
  }

  // Load dashboard data
  useEffect(() => {
    if (activeTab === "dashboard") {
      loadDashboard();
    } else if (activeTab === "users") {
      loadUsers();
    } else if (activeTab === "bookings") {
      loadBookings();
    }
  }, [activeTab]);

  const loadDashboard = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getDashboard();
      setStats(response.data);
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to load dashboard data",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to load users",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async () => {
    try {
      setLoading(true);
      const response = await adminAPI.getRecentBookings();
      setBookings(response.data);
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to load bookings",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      showNotification({
        type: "error",
        message: "Please fill all fields",
      });
      return;
    }

    try {
      await adminAPI.changePassword(passwordData);
      showNotification({
        type: "success",
        message: "Password changed successfully",
      });
      setChangePasswordMode(false);
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      showNotification({
        type: "error",
        message: error.response?.data?.msg || "Failed to change password",
      });
    }
  };

  const handleUpdateUserRole = async (userId, newRole) => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      showNotification({
        type: "success",
        message: "User role updated successfully",
      });
      loadUsers();
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to update user role",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 pb-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">
              🏛️ Admin Panel
            </h1>
            <p className="text-gray-400">Welcome back, {user?.name}</p>
          </div>
          <button
            onClick={() => setChangePasswordMode(!changePasswordMode)}
            className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition"
          >
            🔐 Change Password
          </button>
        </div>

        {/* Change Password Modal */}
        {changePasswordMode && (
          <div className="card mb-8 border-l-4 border-orange-600">
            <h3 className="text-xl font-bold mb-4">Change Password</h3>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-600"
              />
              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-orange-600"
              />
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition"
                >
                  Update Password
                </button>
                <button
                  type="button"
                  onClick={() => setChangePasswordMode(false)}
                  className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex gap-2 mb-8 border-b border-gray-700 overflow-x-auto">
          {[
            { id: "dashboard", label: "📊 Dashboard" },
            { id: "users", label: "👥 Users" },
            { id: "bookings", label: "📅 Bookings" },
            { id: "settings", label: "⚙️ Settings" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-6 py-3 transition whitespace-nowrap ${
                activeTab === tab.id
                  ? "text-orange-500 border-b-2 border-orange-500"
                  : "text-gray-400 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-gray-400">Loading...</div>
          </div>
        )}

        {/* Dashboard Tab */}
        {activeTab === "dashboard" && stats && !loading && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="card hover:border-orange-600 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Total Users</p>
                    <p className="text-3xl font-bold text-orange-500">
                      {stats.stats?.totalUsers || 0}
                    </p>
                  </div>
                  <span className="text-3xl">👥</span>
                </div>
              </div>

              <div className="card hover:border-orange-600 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Total Bookings</p>
                    <p className="text-3xl font-bold text-orange-500">
                      {stats.stats?.totalBookings || 0}
                    </p>
                  </div>
                  <span className="text-3xl">📅</span>
                </div>
              </div>

              <div className="card hover:border-orange-600 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Total Revenue</p>
                    <p className="text-3xl font-bold text-orange-500">
                      ₹{(stats.stats?.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                  <span className="text-3xl">💰</span>
                </div>
              </div>

              <div className="card hover:border-orange-600 transition">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Monasteries</p>
                    <p className="text-3xl font-bold text-orange-500">
                      {stats.stats?.totalMonasteries || 0}
                    </p>
                  </div>
                  <span className="text-3xl">🏛️</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Bookings */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4">📖 Recent Bookings</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stats.recentBookings?.slice(0, 5).map((booking, idx) => (
                    <div key={idx} className="border-b border-gray-700 pb-3">
                      <p className="text-sm text-gray-300">
                        {booking.user?.name || "Unknown"} booked{" "}
                        {booking.monastery?.name || "Unknown"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Users */}
              <div className="card">
                <h3 className="text-xl font-bold mb-4">✨ Recent Users</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {stats.recentUsers?.slice(0, 5).map((u, idx) => (
                    <div key={idx} className="border-b border-gray-700 pb-3">
                      <p className="text-sm text-gray-300">{u.name}</p>
                      <p className="text-xs text-gray-500">{u.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && !loading && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Role</th>
                    <th className="text-left py-3 px-4">Joined</th>
                    <th className="text-left py-3 px-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr
                      key={u._id}
                      className="border-b border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="py-3 px-4">{u.name}</td>
                      <td className="py-3 px-4 text-gray-400">{u.email}</td>
                      <td className="py-3 px-4">
                        <select
                          value={u.role}
                          onChange={(e) =>
                            handleUpdateUserRole(u._id, e.target.value)
                          }
                          className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-white text-sm"
                        >
                          <option value="user">User</option>
                          <option value="editor">Editor</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">
                        <button className="text-red-500 hover:text-red-400 text-sm">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && !loading && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Recent Bookings</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-3 px-4">User</th>
                    <th className="text-left py-3 px-4">Monastery</th>
                    <th className="text-left py-3 px-4">Status</th>
                    <th className="text-left py-3 px-4">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-gray-700 hover:bg-gray-800 transition"
                    >
                      <td className="py-3 px-4">{booking.user?.name}</td>
                      <td className="py-3 px-4">{booking.monastery?.name}</td>
                      <td className="py-3 px-4">
                        <span className="px-3 py-1 bg-green-900 text-green-200 rounded-full text-sm">
                          {booking.bookingStatus || "confirmed"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === "settings" && (
          <div className="card">
            <h2 className="text-2xl font-bold mb-4">Admin Settings</h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">
                  Account Information
                </h3>
                <p className="text-gray-400">
                  Name: <span className="text-white">{user?.name}</span>
                </p>
                <p className="text-gray-400 mt-1">
                  Email: <span className="text-white">{user?.email}</span>
                </p>
                <p className="text-gray-400 mt-1">
                  Role:{" "}
                  <span className="text-orange-500 font-semibold">
                    {user?.role}
                  </span>
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">
                  System Information
                </h3>
                <p className="text-gray-400">
                  API Endpoint:{" "}
                  <span className="text-white text-sm">
                    http://localhost:5000/api
                  </span>
                </p>
                <p className="text-gray-400 mt-1">
                  Version: <span className="text-white">1.0.0</span>
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
