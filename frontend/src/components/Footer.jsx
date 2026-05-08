import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 border-t border-gray-700 py-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold gradient-text mb-4">
              Monastery360
            </h3>
            <p className="text-gray-400 text-sm">
              Explore sacred Buddhist monasteries and spiritual heritage of
              Sikkim.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/monasteries" className="hover:text-orange-500">
                  Monasteries
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-orange-500">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/" className="hover:text-orange-500">
                  Home
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-bold mb-4">Information</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>About Us</li>
              <li>Privacy Policy</li>
              <li>Terms & Conditions</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold mb-4">Contact</h4>
            <p className="text-gray-400 text-sm mb-2">
              📧 udaykumarroynpg@gmail.com
            </p>
            <p className="text-gray-400 text-sm">Sikkim, India</p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 pt-8">
          <p className="text-center text-gray-500 text-sm">
            © 2026 Monastery360. All rights reserved. 🙏
          </p>
        </div>
      </div>
    </footer>
  );
}
