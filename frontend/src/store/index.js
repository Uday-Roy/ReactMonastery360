import { create } from "zustand";

export const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),

  setAuth: (user, token) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    set({ user, token, isAuthenticated: true });
  },

  updateUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    set({ user: userData });
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadFromLocalStorage: () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (token && user) {
      set({ token, user: JSON.parse(user), isAuthenticated: true });
    }
  },
}));

export const useMonasteryStore = create((set) => ({
  monasteries: [],
  selectedMonastery: null,
  loading: false,
  error: null,

  setMonasteries: (monasteries) => set({ monasteries }),
  setSelectedMonastery: (monastery) => set({ selectedMonastery: monastery }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));

export const useBookingStore = create((set) => ({
  bookings: [],
  currentBooking: null,
  loading: false,

  setBookings: (bookings) => set({ bookings }),
  setCurrentBooking: (booking) => set({ currentBooking: booking }),
  setLoading: (loading) => set({ loading }),
  addBooking: (booking) =>
    set((state) => ({ bookings: [...state.bookings, booking] })),
}));

export const useUIStore = create((set) => ({
  sidebarOpen: false,
  darkMode: true,
  notification: null,

  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setDarkMode: (darkMode) => set({ darkMode }),
  showNotification: (notification) => set({ notification }),
  clearNotification: () => set({ notification: null }),
}));
