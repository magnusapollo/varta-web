
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx,mdx}",
    "./components/**/*.{ts,tsx}",
    "./styles/**/*.{css}"
  ],
  theme: {
    extend: {}
  },
  plugins: [require('@tailwindcss/typography')]
};
