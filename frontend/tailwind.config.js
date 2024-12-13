/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      backgroundImage: {
        'light-bg': "url('./components/assets/light-background.png')",
        'dark-bg': "url('./components/assets/dark-background.png')",
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
}