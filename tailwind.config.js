/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        android: {
          green: '#3DDC84',
          greendark: '#2BB86A',
          teal: '#00BFA5',
          blue: '#1E64DC'
        },
        bg: {
          dark: '#080C0E',
          card: '#11171B',
        },
        glass: {
          bg: 'rgba(255, 255, 255, 0.05)',
          border: 'rgba(255, 255, 255, 0.12)',
          borderfocus: 'rgba(61, 220, 132, 0.7)'
        },
        text: {
          primary: '#F0F4F8',
          secondary: 'rgba(240, 244, 248, 0.6)',
          label: 'rgba(240, 244, 248, 0.4)'
        },
        status: {
          error: '#FF5252',
          errorbg: 'rgba(255, 82, 82, 0.15)',
          warn: '#FFB300',
          warnbg: 'rgba(255, 179, 0, 0.15)',
          successbg: 'rgba(61, 220, 132, 0.15)'
        }
      }
    },
  },
  plugins: [],
}
