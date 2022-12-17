/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    fontFamily: {
      body: ["Sen"],
    },
    extend: {
      colors: {
        bgb: "#1B1A1D",
        bwh: "#E1E1E1",
        bg1: "#2B2D2E",
        bg2: "#A4A7A9",
        re: "#ED4956",
      },
    },
  },
  plugins: [],
};
