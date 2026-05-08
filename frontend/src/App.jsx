import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore, useUIStore } from "./store/index";

// Pages
import Home from "./pages/Home";
import Monasteries from "./pages/Monasteries";
import MonasteryDetail from "./pages/MonasteryDetail";
import Booking from "./pages/Booking";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";

// Components
import Header from "./components/Header";
import Footer from "./components/Footer";
import Notification from "./components/Notification";
import CookieConsent from "./components/CookieConsent";

function App() {
  const { loadFromLocalStorage, isAuthenticated } = useAuthStore();
  const { darkMode } = useUIStore();

  useEffect(() => {
    loadFromLocalStorage();
  }, [loadFromLocalStorage]);

  return (
    <div className={darkMode ? "dark" : ""}>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
          <Header />
          <Notification />
          <CookieConsent />
          <main className="pt-20">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/monasteries" element={<Monasteries />} />
              <Route path="/monastery/:id" element={<MonasteryDetail />} />
              <Route path="/booking/:id" element={<Booking />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/auth" element={<Auth />} />
              {isAuthenticated && (
                <>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/admin" element={<AdminPanel />} />
                </>
              )}
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </div>
  );
}

export default App;
