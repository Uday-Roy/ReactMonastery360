import React, { useState } from "react";
import { authAPI } from "../utils/api";
import { useAuthStore, useUIStore } from "../store/index";
import { useNavigate } from "react-router-dom";

export default function Auth() {
  const [mode, setMode] = useState("login"); // login, signup, otp
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { setAuth } = useAuthStore();
  const { showNotification } = useUIStore();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      showNotification({
        type: "error",
        message: "Please fill all fields",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.login({ email, password });
      setAuth(response.data.user, response.data.token);
      showNotification({
        type: "success",
        message: "Login successful!",
      });
      navigate("/");
    } catch (error) {
      showNotification({
        type: "error",
        message: error.response?.data?.msg || "Login failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      showNotification({
        type: "error",
        message: "Please fill all fields",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await authAPI.signup({ name, email, password });
      setAuth(response.data.user, response.data.token);
      showNotification({
        type: "success",
        message: "Signup successful!",
      });
      navigate("/");
    } catch (error) {
      showNotification({
        type: "error",
        message: error.response?.data?.msg || "Signup failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestAccess = async () => {
    try {
      setLoading(true);
      const response = await authAPI.guestAccess();
      setAuth(response.data.user, response.data.token);
      showNotification({
        type: "success",
        message: "Guest session created",
      });
      navigate("/");
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to create guest session",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        {/* Mode Tabs */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              mode === "login"
                ? "bg-orange-600 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("signup")}
            className={`flex-1 py-3 rounded-lg font-semibold transition ${
              mode === "signup"
                ? "bg-orange-600 text-white"
                : "bg-gray-800 text-gray-400"
            }`}
          >
            Signup
          </button>
        </div>

        {/* Forms */}
        <div className="card">
          {mode === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>
          )}

          {mode === "signup" && (
            <form onSubmit={handleSignup} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-orange-500 outline-none"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn-primary disabled:opacity-50"
              >
                {loading ? "Creating account..." : "Signup"}
              </button>
            </form>
          )}

          {/* Guest Access */}
          <div className="mt-6 pt-6 border-t border-gray-700">
            <button
              onClick={handleGuestAccess}
              disabled={loading}
              className="w-full btn-secondary disabled:opacity-50"
            >
              {loading ? "Creating..." : "Continue as Guest"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
