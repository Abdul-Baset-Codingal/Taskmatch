/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    // Safelist for dynamic gradient classes based on 'orange' or 'teal'
    {
      pattern: /(from|to)-(orange|teal)-(100|200|300|400|500|600|700|800|900|950)/,
    },
  ],
  theme: {
    extend: {
      fontFamily: {
        nunito: ['"Nunito Sans"', 'sans-serif'],
        josefin: ['"Josefin Sans"', 'sans-serif'],
        ptsans: ['"PT Sans"', 'sans-serif'],
      },
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