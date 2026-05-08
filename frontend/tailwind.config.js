/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2c3e50",
        secondary: "#e67e22",
        accent: "#f39c12",
        dark: "#0a0e27",
        light: "#f5f5f5",
        cream: "#fff8ec",
      },
      fontFamily: {
        sans: ["Segoe UI", "Tahoma", "Geneva", "Verdana", "sans-serif"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-20px)" },
        },
        fadeInUp: {
          from: { opacity: "0", transform: "translateY(30px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        slideIn: {
          from: { opacity: "0", transform: "translateX(-30px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        fadeInUp: "fadeInUp 0.6s ease-out",
        slideIn: "slideIn 0.5s ease-out",
      },
    },
  },
  plugins: [],
};
