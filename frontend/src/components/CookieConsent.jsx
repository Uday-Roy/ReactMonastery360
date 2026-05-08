import React, { useState, useEffect } from "react";
import axios from "axios";

export default function CookieConsent() {
  const [showConsent, setShowConsent] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);

  useEffect(() => {
    // Check if user has already given consent
    const consentData = localStorage.getItem("cookieConsent");
    if (!consentData) {
      setShowConsent(true);
    }
  }, []);

  const handleAcceptAll = async () => {
    const consentData = {
      analytics: true,
      marketing: true,
      accepted: true,
      acceptedAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem("cookieConsent", JSON.stringify(consentData));

    // Update in database if user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.put(
          "http://localhost:5000/api/auth/profile",
          { cookieConsent: consentData },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (err) {
        console.log("Cookie consent saved to localStorage");
      }
    }

    setShowConsent(false);
  };

  const handleCustom = async () => {
    const consentData = {
      analytics,
      marketing,
      accepted: true,
      acceptedAt: new Date().toISOString(),
    };

    // Save to localStorage
    localStorage.setItem("cookieConsent", JSON.stringify(consentData));

    // Update in database if user is authenticated
    const token = localStorage.getItem("token");
    if (token) {
      try {
        await axios.put(
          "http://localhost:5000/api/auth/profile",
          { cookieConsent: consentData },
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        );
      } catch (err) {
        console.log("Cookie consent saved to localStorage");
      }
    }

    setShowConsent(false);
  };

  const handleReject = async () => {
    const consentData = {
      analytics: false,
      marketing: false,
      accepted: true,
      acceptedAt: new Date().toISOString(),
    };

    localStorage.setItem("cookieConsent", JSON.stringify(consentData));
    setShowConsent(false);
  };

  if (!showConsent) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-700 shadow-2xl z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Message */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-2 gradient-text">
              🍪 Cookie Preferences
            </h3>
            <p className="text-gray-400 text-sm mb-4">
              We use cookies to enhance your experience and analyze our website
              traffic. You can control how cookies are used below.
            </p>

            {/* Custom Options */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={true}
                  disabled
                  className="w-5 h-5 rounded bg-gray-700 accent-orange-600"
                />
                <span className="text-sm">
                  <strong>Essential Cookies</strong> (Always enabled)
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={analytics}
                  onChange={(e) => setAnalytics(e.target.checked)}
                  className="w-5 h-5 rounded bg-gray-700 accent-orange-600"
                />
                <span className="text-sm">
                  <strong>Analytics Cookies</strong> - Help us understand how
                  you use our site
                </span>
              </label>

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={marketing}
                  onChange={(e) => setMarketing(e.target.checked)}
                  className="w-5 h-5 rounded bg-gray-700 accent-orange-600"
                />
                <span className="text-sm">
                  <strong>Marketing Cookies</strong> - Used for personalized
                  advertising
                </span>
              </label>
            </div>

            <p className="text-xs text-gray-500 mt-4">
              <a href="#" className="hover:text-orange-500">
                Privacy Policy
              </a>
              {" | "}
              <a href="#" className="hover:text-orange-500">
                Cookie Settings
              </a>
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 justify-end">
            <button
              onClick={handleAcceptAll}
              className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg font-semibold transition whitespace-nowrap"
            >
              Accept All
            </button>
            <button
              onClick={handleCustom}
              className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition whitespace-nowrap"
            >
              Save Preferences
            </button>
            <button
              onClick={handleReject}
              className="px-6 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg font-semibold transition whitespace-nowrap text-gray-300"
            >
              Reject Optional
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
