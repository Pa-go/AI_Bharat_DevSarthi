/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // <--- This connects the dark mode toggle!
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}