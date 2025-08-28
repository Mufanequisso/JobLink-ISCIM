/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1976D2',
        secondary: '#FFC107',
        success: '#4CAF50',
        error: '#F44336',
        background: '#F5F5F5',
      },
    },
  },
  plugins: [],
}
