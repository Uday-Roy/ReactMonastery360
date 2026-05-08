import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { bookingAPI, paymentAPI, monasteryAPI } from "../utils/api";
import { useUIStore } from "../store/index";

export default function Booking() {
  const location = useLocation();
  const navigate = useNavigate();
  const { showNotification } = useUIStore();

  const [selectedMonastery, setSelectedMonastery] = useState(null);
  const [monasteries, setMonasteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    monasteryId: location.state?.monasteryId || "",
    date: location.state?.date || "",
    numberOfPeople: location.state?.people || 1,
    name: "",
    email: "",
    phone: "",
    specialRequests: "",
  });

  const [pricing] = useState({
    perPersonPrice: 2000,
    adultsCount: 2,
    childrenCount: 0,
  });

  useEffect(() => {
    loadMonasteries();
  }, []);

  useEffect(() => {
    if (formData.monasteryId) {
      const monastery = monasteries.find((m) => m._id === formData.monasteryId);
      setSelectedMonastery(monastery);
    }
  }, [formData.monasteryId, monasteries]);

  const loadMonasteries = async () => {
    try {
      const response = await monasteryAPI.getAll({ limit: 16 });
      setMonasteries(response.data);
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to load monasteries",
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateTotal = () => {
    return formData.numberOfPeople * pricing.perPersonPrice;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "numberOfPeople" ? parseInt(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.monasteryId ||
      !formData.date ||
      !formData.name ||
      !formData.email ||
      !formData.phone
    ) {
      showNotification({
        type: "error",
        message: "Please fill all required fields",
      });
      return;
    }

    try {
      setSubmitting(true);

      // Create booking
      const bookingData = {
        monastery: formData.monasteryId,
        date: formData.date,
        numberOfPeople: formData.numberOfPeople,
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        specialRequests: formData.specialRequests,
        totalAmount: calculateTotal(),
      };

      const bookingResponse = await bookingAPI.create(bookingData);

      showNotification({
        type: "success",
        message: "Booking created successfully!",
      });

      // Proceed to payment
      const totalAmount = calculateTotal();
      const paymentResponse = await paymentAPI.createOrder(totalAmount, "INR");

      // Open Razorpay payment modal
      const options = {
        key: "rzp_test_ShPgB3xsF59LrY",
        amount: totalAmount * 100,
        currency: "INR",
        name: "Monastery360",
        description: `Tour Booking - ${selectedMonastery?.name}`,
        order_id: paymentResponse.data.id,
        handler: async (response) => {
          try {
            // Verify payment
            await paymentAPI.verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            showNotification({
              type: "success",
              message: "Payment successful! Your tour is confirmed.",
            });

            setTimeout(() => navigate("/dashboard"), 2000);
          } catch (error) {
            showNotification({
              type: "error",
              message: "Payment verification failed",
            });
          }
        },
        prefill: {
          name: formData.name,
          email: formData.email,
          contact: formData.phone,
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      showNotification({
        type: "error",
        message: error.response?.data?.message || "Booking failed",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-2xl text-white">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold mb-2 gradient-text">
          Book Your Monastery Tour
        </h1>
        <p className="text-gray-400 mb-12">
          Reserve your sacred journey to explore Sikkim's spiritual heritage
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Booking Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card space-y-6">
              <div>
                <label className="block text-white font-semibold mb-2">
                  Select Monastery *
                </label>
                <select
                  name="monasteryId"
                  value={formData.monasteryId}
                  onChange={handleInputChange}
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
                >
                  <option value="">Choose a monastery...</option>
                  {monasteries.map((m) => (
                    <option key={m._id} value={m._id}>
                      {m.name} - {m.region}
                    </option>
                  ))}
                </select>
              </div>

              {selectedMonastery && (
                <div className="bg-gray-900 p-4 rounded-lg border border-orange-500">
                  <p className="text-orange-400 font-semibold">
                    {selectedMonastery.name}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {selectedMonastery.description?.substring(0, 100)}...
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Tour Date *
                  </label>
                  <input
                    type="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Number of People *
                  </label>
                  <input
                    type="number"
                    name="numberOfPeople"
                    value={formData.numberOfPeople}
                    onChange={handleInputChange}
                    min="1"
                    max="10"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-white font-semibold mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-semibold mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-white font-semibold mb-2">
                  Special Requests
                </label>
                <textarea
                  name="specialRequests"
                  value={formData.specialRequests}
                  onChange={handleInputChange}
                  placeholder="Any special requirements or dietary preferences..."
                  rows="4"
                  className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary py-3 font-bold text-lg disabled:opacity-50"
              >
                {submitting ? "Processing..." : "Proceed to Payment"}
              </button>
            </form>
          </div>

          {/* Price Summary */}
          <div className="card sticky top-24 h-fit">
            <h3 className="text-2xl font-bold mb-6 text-orange-400">
              Booking Summary
            </h3>

            {selectedMonastery && (
              <div className="mb-6">
                <img
                  src={
                    selectedMonastery.image ||
                    "https://via.placeholder.com/400x300"
                  }
                  alt={selectedMonastery.name}
                  className="w-full h-32 object-cover rounded-lg mb-3"
                />
                <p className="text-white font-semibold">
                  {selectedMonastery.name}
                </p>
              </div>
            )}

            <div className="space-y-3 border-t border-gray-700 pt-4">
              <div className="flex justify-between">
                <span className="text-gray-400">Tour Date:</span>
                <span className="text-white font-semibold">
                  {formData.date || "Not selected"}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Number of Guests:</span>
                <span className="text-white font-semibold">
                  {formData.numberOfPeople}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-gray-400">Price per Person:</span>
                <span className="text-white font-semibold">
                  ₹{pricing.perPersonPrice}
                </span>
              </div>

              <div className="border-t border-gray-700 pt-3 flex justify-between">
                <span className="text-lg font-bold">Total Amount:</span>
                <span className="text-2xl font-bold text-orange-400">
                  ₹{calculateTotal().toLocaleString()}
                </span>
              </div>

              <div className="bg-gray-900 rounded-lg p-4 mt-6">
                <p className="text-gray-400 text-sm">
                  ✓ Guided tour by certified local guide
                </p>
                <p className="text-gray-400 text-sm">
                  ✓ All monument entry fees included
                </p>
                <p className="text-gray-400 text-sm">✓ Photography permitted</p>
                <p className="text-gray-400 text-sm">
                  ✓ Flexible cancellation policy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
