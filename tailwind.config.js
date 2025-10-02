/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        advocateGreen: '#1E9152',
        advocateDark: '#0D3B2E',
      },
    },
  },
  plugins: [],
}
