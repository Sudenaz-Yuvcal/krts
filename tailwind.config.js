/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        luxury: {
          bg: "#09090B", 
          card: "#18181B", 
          gold: "#D4AF37", 
          silver: "#A1A1AA", 
          white: "#F4F4F5",
        },
      },
      fontFamily: {
        title: ["Syne", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
