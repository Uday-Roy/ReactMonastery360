import React, { useEffect } from "react";
import { useUIStore } from "../store/index";

export default function Notification() {
  const { notification, clearNotification } = useUIStore();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => clearNotification(), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification, clearNotification]);

  if (!notification) return null;

  const bgColor =
    {
      success: "bg-green-600",
      error: "bg-red-600",
      info: "bg-blue-600",
      warning: "bg-yellow-600",
    }[notification.type] || "bg-gray-600";

  return (
    <div
      className={`fixed top-20 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-40 animate-fadeInUp`}
    >
      {notification.message}
    </div>
  );
}
