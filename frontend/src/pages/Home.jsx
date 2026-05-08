import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { monasteryAPI, contactAPI } from "../utils/api";
import { useUIStore } from "../store/index";

export default function Home() {
  const [monasteries, setMonasteries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [tourForm, setTourForm] = useState({
    monasteryId: "",
    date: "",
    people: 1,
  });
  const [aiMessage, setAiMessage] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useUIStore();

  useEffect(() => {
    loadMonasteries();
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCarouselIdx((prev) => (prev + 1) % Math.max(monasteries.length, 1));
    }, 3000);
    return () => clearInterval(timer);
  }, [monasteries.length]);

  const loadMonasteries = async () => {
    try {
      setLoading(false);
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

  const handleAiChat = async () => {
    if (!aiMessage.trim()) return;

    try {
      setAiLoading(true);
      const response = await contactAPI.aiChat(aiMessage);
      setAiResponse(response.data.response);
      setAiMessage("");
      showNotification({
        type: "success",
        message: "AI response generated",
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: "AI chat unavailable",
      });
    } finally {
      setAiLoading(false);
    }
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (
      !contactForm.name ||
      !contactForm.email ||
      !contactForm.subject ||
      !contactForm.message
    ) {
      showNotification({
        type: "error",
        message: "Please fill all fields",
      });
      return;
    }

    try {
      setSubmitting(true);
      await contactAPI.sendMessage(contactForm);
      showNotification({
        type: "success",
        message: "Message sent successfully!",
      });
      setContactForm({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to send message",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleTourBooking = async (e) => {
    e.preventDefault();
    if (!tourForm.monasteryId || !tourForm.date) {
      showNotification({
        type: "error",
        message: "Please select monastery and date",
      });
      return;
    }

    try {
      setSubmitting(true);
      // Navigate to booking page with tour details
      navigate("/booking", { state: tourForm });
      showNotification({
        type: "success",
        message: "Proceeding to booking...",
      });
    } catch (error) {
      showNotification({
        type: "error",
        message: "Failed to proceed with booking",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const photoGalleryImages = [
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=500&q=80",
    "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=500&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&q=80",
    "https://images.unsplash.com/photo-1490391859352-8ac466586f90?w=500&q=80",
    "https://images.unsplash.com/photo-1495854035989-cebdbdd97913?w=500&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&q=80",
    "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=500&q=80",
    "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=500&q=80",
    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=500&q=80",
    "https://images.unsplash.com/photo-1493514789a586cb0d8a3a8c0908a67e?w=500&q=80",
  ];

  const tours = [
    {
      id: 1,
      name: "East Sikkim Heritage Tour",
      monasteries: 4,
      duration: "3 days",
      price: "₹5,999",
      image:
        "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=400&q=80",
      description: "Visit Gangtok, Rumtek, and Tsuk La Khang monasteries",
    },
    {
      id: 2,
      name: "West Sikkim Pilgrimage",
      monasteries: 5,
      duration: "4 days",
      price: "₹7,999",
      image:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&q=80",
      description: "Sacred route through Pemayangtse and Kanchenjunga areas",
    },
    {
      id: 3,
      name: "North Sikkim Expedition",
      monasteries: 3,
      duration: "5 days",
      price: "₹9,999",
      image:
        "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&q=80",
      description: "Remote monasteries and pristine mountain landscapes",
    },
    {
      id: 4,
      name: "Complete Circuit Tour",
      monasteries: 12,
      duration: "7 days",
      price: "₹14,999",
      image:
        "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&q=80",
      description: "Visit all major monasteries across all Sikkim regions",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* HERO SECTION */}
      <section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1920&q=80')`,
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-gray-900"></div>

        <div className="relative z-10 text-center max-w-4xl px-4">
          <div className="mb-6 text-orange-400 font-semibold text-lg">
            ☸ Sikkim Travel OS · Monastery360
          </div>
          <h1 className="text-6xl md:text-7xl font-bold mb-6 leading-tight">
            Discover Sacred <span className="text-orange-400">Sikkim</span> with
            a Living Digital Guide
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 mb-8">
            Explore monasteries, plan guided tours, save favourites, and let
            your team update every important page detail without touching code.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <button
              onClick={() => navigate("/monasteries")}
              className="btn-primary text-lg px-8 py-3 rounded-lg font-bold"
            >
              ✦ Start Exploring
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("payment")
                  .scrollIntoView({ behavior: "smooth" })
              }
              className="btn-secondary text-lg px-8 py-3 rounded-lg font-bold"
            >
              📖 Book a Tour
            </button>
          </div>

          {/* Stats Strip */}
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">
                16
              </div>
              <div className="text-gray-300">Monasteries</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">
                4
              </div>
              <div className="text-gray-300">Regions</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">
                500+
              </div>
              <div className="text-gray-300">Years History</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-orange-400">
                12K+
              </div>
              <div className="text-gray-300">Visitors</div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10 animate-bounce">
          <div className="text-center text-orange-400">
            <div className="text-2xl">↓</div>
          </div>
        </div>
      </section>

      {/* FEATURED GALLERY SECTION */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-orange-400 font-semibold mb-2">
              ✦ Featured Gallery
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              A Moving Window Into Sikkim
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Sixteen sacred places, shifting every moment with soft cinematic
              motion.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative h-96 md:h-96 rounded-2xl overflow-hidden shadow-2xl mb-12">
            <div className="relative h-full">
              {monasteries.length > 0 &&
                monasteries.map((m, idx) => (
                  <div
                    key={m._id}
                    className={`absolute inset-0 transition-all duration-700 ${
                      idx === carouselIdx
                        ? "opacity-100 scale-100"
                        : "opacity-0 scale-105"
                    }`}
                  >
                    <img
                      src={m.image || "https://via.placeholder.com/800x400"}
                      alt={m.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent flex items-end p-8">
                      <div>
                        <h3 className="text-3xl font-bold text-white mb-2">
                          {m.name}
                        </h3>
                        <p className="text-orange-300 text-lg">{m.region}</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>

            {/* Controls */}
            {monasteries.length > 0 && (
              <div className="absolute inset-0 flex items-center justify-between p-4 z-10">
                <button
                  onClick={() =>
                    setCarouselIdx(
                      (prev) =>
                        (prev - 1 + monasteries.length) % monasteries.length,
                    )
                  }
                  className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full transition"
                >
                  ❮
                </button>
                <button
                  onClick={() =>
                    setCarouselIdx((prev) => (prev + 1) % monasteries.length)
                  }
                  className="bg-orange-600 hover:bg-orange-700 text-white p-3 rounded-full transition"
                >
                  ❯
                </button>
              </div>
            )}
          </div>

          {/* Photo Grid Gallery */}
          <div>
            <h3 className="text-2xl font-bold mb-8">
              Explore Monastery Gallery 📸
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {photoGalleryImages.map((img, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-lg h-48 cursor-pointer group"
                >
                  <img
                    src={img}
                    alt={`Gallery ${idx}`}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TOUR BOOKING SECTION */}
      <section
        id="payment"
        className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-orange-400 font-semibold mb-2">
              ✦ Guided Experiences
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Book Your Monastery Tour
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Choose from curated travel packages and guided experiences led by
              certified local guides.
            </p>
          </div>

          {/* Quick Booking Form */}
          <div className="bg-gray-900 rounded-xl p-6 md:p-8 mb-16 shadow-lg border border-gray-700">
            <h3 className="text-2xl font-bold mb-6">Quick Tour Booking</h3>
            <form
              onSubmit={handleTourBooking}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <select
                value={tourForm.monasteryId}
                onChange={(e) =>
                  setTourForm({ ...tourForm, monasteryId: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
              >
                <option value="">Select a Monastery</option>
                {monasteries.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name}
                  </option>
                ))}
              </select>

              <input
                type="date"
                value={tourForm.date}
                onChange={(e) =>
                  setTourForm({ ...tourForm, date: e.target.value })
                }
                className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
              />

              <input
                type="number"
                min="1"
                max="10"
                value={tourForm.people}
                onChange={(e) =>
                  setTourForm({ ...tourForm, people: parseInt(e.target.value) })
                }
                className="bg-gray-800 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
                placeholder="Number of people"
              />

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary disabled:opacity-50 font-bold"
              >
                {submitting ? "Booking..." : "Book Now"}
              </button>
            </form>
          </div>

          {/* Tour Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {tours.map((tour) => (
              <div
                key={tour.id}
                className="bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-700 hover:border-orange-500 transition group cursor-pointer"
              >
                <div className="relative overflow-hidden h-48">
                  <img
                    src={tour.image}
                    alt={tour.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 right-4 bg-orange-600 text-white px-3 py-1 rounded-full text-sm font-bold">
                    {tour.price}
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">
                    {tour.description}
                  </p>

                  <div className="flex justify-between items-center mb-4 text-sm text-orange-400">
                    <span>📿 {tour.monasteries} Monasteries</span>
                    <span>⏱️ {tour.duration}</span>
                  </div>

                  <button
                    onClick={() => {
                      setTourForm({
                        ...tourForm,
                        monasteryId: tours[tour.id - 1]._id,
                      });
                      document
                        .getElementById("payment")
                        .scrollIntoView({ behavior: "smooth" });
                    }}
                    className="w-full btn-primary font-bold"
                  >
                    Book This Tour
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PHOTO GALLERY SHOWCASE */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">✨ Monastery Showcase</h2>
            <p className="text-gray-400">
              Visual-first gallery of sacred architecture and cultural heritage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monasteries.slice(0, 6).map((m) => (
              <div
                key={m._id}
                className="bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition cursor-pointer"
                onClick={() => navigate(`/monastery/${m._id}`)}
              >
                <div className="relative overflow-hidden h-64">
                  <img
                    src={m.image || "https://via.placeholder.com/400x300"}
                    alt={m.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{m.name}</h3>
                  <p className="text-orange-400 text-sm mb-3">{m.region}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-yellow-400">★ {m.rating || 4.5}</span>
                    <button className="btn-primary text-sm py-1 px-3">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT SECTION */}
      <section
        id="contact"
        className="py-20 px-4 bg-gradient-to-br from-gray-800 to-gray-900"
      >
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-orange-400 font-semibold mb-2">
              ✦ Get in Touch
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Have questions about your visit? Our local Gangtok team is ready
              to help plan your pilgrimage.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Info */}
            <div>
              <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="text-2xl text-orange-400 flex-shrink-0">
                    📍
                  </div>
                  <div>
                    <div className="font-bold mb-1">Address</div>
                    <div className="text-gray-400">Gangtok, Sikkim, India</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl text-orange-400 flex-shrink-0">
                    📞
                  </div>
                  <div>
                    <div className="font-bold mb-1">Phone</div>
                    <div className="text-gray-400">+91 97080 98765</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl text-orange-400 flex-shrink-0">
                    ✉️
                  </div>
                  <div>
                    <div className="font-bold mb-1">Email</div>
                    <div className="text-gray-400">info@monastery360.com</div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="text-2xl text-orange-400 flex-shrink-0">
                    🕒
                  </div>
                  <div>
                    <div className="font-bold mb-1">Hours</div>
                    <div className="text-gray-400">
                      Mon-Fri: 9AM - 6PM <br /> Sat-Sun: 10AM - 4PM
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Links */}
              <div className="mt-12 flex gap-4">
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-700 hover:bg-orange-600 rounded-full flex items-center justify-center transition"
                >
                  f
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-700 hover:bg-orange-600 rounded-full flex items-center justify-center transition"
                >
                  in
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-700 hover:bg-orange-600 rounded-full flex items-center justify-center transition"
                >
                  𝕏
                </a>
                <a
                  href="#"
                  className="w-12 h-12 bg-gray-700 hover:bg-orange-600 rounded-full flex items-center justify-center transition"
                >
                  yt
                </a>
              </div>
            </div>

            {/* Contact Form */}
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={contactForm.name}
                onChange={(e) =>
                  setContactForm({ ...contactForm, name: e.target.value })
                }
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
              />

              <input
                type="email"
                placeholder="Email Address"
                value={contactForm.email}
                onChange={(e) =>
                  setContactForm({ ...contactForm, email: e.target.value })
                }
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
              />

              <input
                type="text"
                placeholder="Subject"
                value={contactForm.subject}
                onChange={(e) =>
                  setContactForm({ ...contactForm, subject: e.target.value })
                }
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
              />

              <textarea
                placeholder="Your message..."
                value={contactForm.message}
                onChange={(e) =>
                  setContactForm({ ...contactForm, message: e.target.value })
                }
                rows="5"
                className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none resize-none"
              ></textarea>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-primary font-bold py-3 disabled:opacity-50"
              >
                {submitting ? "Sending..." : "Send Message ✦"}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* AI ASSISTANT */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">🤖 AI Trip Planner</h2>
            <p className="text-gray-400">
              Ask our AI assistant about monasteries, tours, and travel tips
            </p>
          </div>

          <div className="bg-gray-800 rounded-xl p-8 border border-gray-700">
            <div className="flex gap-3 mb-6">
              <input
                type="text"
                value={aiMessage}
                onChange={(e) => setAiMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleAiChat()}
                placeholder="Ask about monasteries, travel tips, or plan your trip..."
                className="flex-1 bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-orange-500 outline-none"
              />
              <button
                onClick={handleAiChat}
                disabled={aiLoading}
                className="btn-primary disabled:opacity-50 px-6 font-bold"
              >
                {aiLoading ? "..." : "Ask AI"}
              </button>
            </div>

            {aiResponse && (
              <div className="bg-gray-900 p-6 rounded-lg border-l-4 border-orange-500">
                <p className="text-gray-200 leading-relaxed">{aiResponse}</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 px-4 bg-gray-800">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="text-orange-400 font-semibold mb-2">
              ✦ ✪ Traveller Stories
            </div>
            <h2 className="text-4xl font-bold mb-4">What Visitors Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                name: "Rajesh Kumar",
                review:
                  "Amazing experience! The tour guides were knowledgeable and friendly. The monasteries were breathtaking.",
                rating: 5,
              },
              {
                name: "Sarah Johnson",
                review:
                  "A spiritual journey I'll never forget. The landscapes are incredible and the monks were welcoming.",
                rating: 5,
              },
              {
                name: "Priya Sharma",
                review:
                  "Best decision to book through Monastery360. Everything was well-organized and peaceful.",
                rating: 4,
              },
            ].map((testimonial, idx) => (
              <div
                key={idx}
                className="bg-gray-900 rounded-xl p-6 border border-gray-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <span
                      key={i}
                      className={
                        i < testimonial.rating
                          ? "text-yellow-400"
                          : "text-gray-600"
                      }
                    >
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-gray-300 mb-4">"{testimonial.review}"</p>
                <p className="font-bold">{testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scroll to Top Button */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className="fixed bottom-8 right-8 bg-orange-600 hover:bg-orange-700 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition"
      >
        ↑
      </button>
    </div>
  );
}
