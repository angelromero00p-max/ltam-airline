/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0B153D',
        secondary: '#E8114B',
        'latam-blue': '#1b0088', // Adjusted to match the deep blue in header
        'latam-red': '#e8114b',
      }
    },
  },
  plugins: [],
}
