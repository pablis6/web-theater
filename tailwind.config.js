/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#e2e8f0",
        secondary: "#0f172a",
        // tertiary: "#d1d5db",
        tertiary: "#cbd5e1",
        cuaternary: "#94a3b8",
        accent: "#0aa3b9",
        accentsoft: "#0aa3b9",
        select: "#94a3b8",
        dark: {
          // primary: "#030712", //"#1E293B",
          // primary: "#0f172a",
          primary: "#1e293b",
          // secondary: "#dbeafe",
          secondary: "#f1f5f9",
          tertiary: "#4b5563",
          // cuaternary: "#9ca3af",
          cuaternary: "#334155",
          accent: "#0aa3b9",
          accentsoft: "#0aa3b9",
          select: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};
