/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class", // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        primary: "#e2e8f0",
        secondary: "#0F172A",
        accent: "#0aa3b9",
        select: "#94a3b8",
        dark: {
          // primary: "#030712", //"#1E293B",
          primary: "#0f172a",
          // primary: "#1E293B",
          secondary: "#dbeafe",
          accent: "#0aa3b9",
          select: "#94a3b8",
        },
      },
    },
  },
  plugins: [],
};
