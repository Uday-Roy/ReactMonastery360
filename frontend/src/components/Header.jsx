import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore, useUIStore } from "../store/index";

export default function Header() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { toggleSidebar } = useUIStore();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="fixed top-0 w-full bg-gradient-to-r from-gray-900 to-gray-800 border-b border-orange-500 shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className="text-3xl">🏔️</span>
          <span className="text-xl font-bold gradient-text">Monastery360</span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex gap-8">
          <Link to="/" className="hover:text-orange-500 transition">
            Home
          </Link>
          <Link to="/monasteries" className="hover:text-orange-500 transition">
            Monasteries
          </Link>
          <Link to="/contact" className="hover:text-orange-500 transition">
            Contact
          </Link>
        </nav>

        {/* Auth Section */}
        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 bg-orange-600 px-4 py-2 rounded-lg hover:bg-orange-700 transition"
              >
                <span>{user?.name || "User"}</span>
                <span>▼</span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-50">
                  <Link
                    to="/dashboard"
                    className="block px-4 py-2 hover:bg-gray-700"
                  >
                    My Dashboard
                  </Link>
                  {user?.role === "admin" && (
                    <Link
                      to="/admin"
                      className="block px-4 py-2 hover:bg-gray-700"
                    >
                      Admin Panel
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 hover:bg-red-700"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="btn-primary">
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
