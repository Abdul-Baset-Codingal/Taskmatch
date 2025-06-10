/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      keyframes: {
        bubble1: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(20px) translateX(10px)" },
        },
        bubble2: {
          "0%, 100%": { transform: "translateY(0) translateX(0)" },
          "50%": { transform: "translateY(25px) translateX(-15px)" },
        },
      },
      animation: {
        bubble1: "bubble1 6s ease-in-out infinite",
        bubble2: "bubble2 8s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
