/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "../src/**/*.{js,ts,jsx,tsx}",  // Include parent src directory
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '72': '18rem',
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}
