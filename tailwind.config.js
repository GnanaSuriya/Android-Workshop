/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'android-green': '#3DDC84',
        'android-green-dark': '#34C475',
      }
    },
  },
  plugins: [],
}
