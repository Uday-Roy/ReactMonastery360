import React, { useState, useRef } from "react";
import { useAuthStore, useUIStore } from "../store/index";
import axios from "axios";

export default function Dashboard() {
  const { user, updateUser } = useAuthStore();
  const { showNotification } = useUIStore();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const fileInputRef = useRef(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      showNotification({
        type: "error",
        message: "Please select an image file",
      });
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      showNotification({
        type: "error",
        message: "Image size must be less than 5MB",
      });
      return;
    }

    try {
      setIsUploadingPhoto(true);

      // Convert file to base64
      const reader = new FileReader();
      reader.onload = async (event) => {
        const photoData = event.target?.result;

        try {
          const response = await axios.post(
            "http://localhost:5000/api/auth/upload-profile-photo",
            { photoData },
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            },
          );

          if (response.data.user) {
            updateUser(response.data.user);
            showNotification({
              type: "success",
              message: "Profile photo updated successfully",
            });
          }
        } catch (error) {
          showNotification({
            type: "error",
            message: error.response?.data?.msg || "Failed to upload photo",
          });
        } finally {
          setIsUploadingPhoto(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to process image",
      });
      setIsUploadingPhoto(false);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        profileData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );

      if (response.data.user) {
        updateUser(response.data.user);
        setIsEditingProfile(false);
        showNotification({
          type: "success",
          message: "Profile updated successfully",
        });
      }
    } catch (error) {
      showNotification({
        type: "error",
        message: error.response?.data?.msg || "Failed to update profile",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 gradient-text">My Dashboard</h1>

        <div className="card mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8 mb-8">
            {/* Profile Photo Section */}
            <div className="flex flex-col items-center">
              <div
                onClick={handlePhotoClick}
                className={`relative w-32 h-32 rounded-full border-4 border-orange-500 overflow-hidden flex items-center justify-center ${
                  isUploadingPhoto ? "opacity-50" : ""
                } ${
                  !user?.profilePhoto
                    ? "bg-gradient-to-br from-orange-400 to-orange-600"
                    : "bg-gray-700"
                } cursor-pointer hover:border-orange-400 transition group`}
              >
                {user?.profilePhoto ? (
                  <img
                    src={user.profilePhoto}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center">
                    <span className="text-5xl">
                      {user?.name?.charAt(0)?.toUpperCase() || "👤"}
                    </span>
                  </div>
                )}

                {/* Upload Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <span className="text-white text-center">
                    {isUploadingPhoto ? "Uploading..." : "Click to upload"}
                  </span>
                </div>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                disabled={isUploadingPhoto}
              />

              <p className="text-gray-400 text-sm mt-3">
                Click to upload profile photo
              </p>
            </div>

            {/* User Info Section */}
            <div className="flex-1">
              {isEditingProfile ? (
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Name
                    </label>
                    <input
                      type="text"
                      value={profileData.name}
                      onChange={(e) =>
                        setProfileData({ ...profileData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) =>
                        setProfileData({
                          ...profileData,
                          phone: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2 rounded-lg bg-gray-700 border border-gray-600 text-white focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditingProfile(false)}
                      className="px-6 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2">{user?.name}</h2>
                  <p className="text-gray-400 mb-2">Email: {user?.email}</p>
                  <p className="text-gray-400 mb-4">
                    Phone: {user?.phone || "Not added"}
                  </p>
                  <p className="text-gray-400 mb-4">Role: {user?.role}</p>

                  <button
                    onClick={() => setIsEditingProfile(true)}
                    className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded-lg transition"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">My Bookings</h3>
              <p className="text-3xl font-bold text-orange-500">0</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Total Spent</h3>
              <p className="text-3xl font-bold text-orange-500">₹0</p>
            </div>
            <div className="bg-gray-700 p-6 rounded-lg">
              <h3 className="text-lg font-bold mb-2">Reviews Given</h3>
              <p className="text-3xl font-bold text-orange-500">0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
