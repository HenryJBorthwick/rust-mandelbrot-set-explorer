/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    fontFamily: {
      sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
    },
    extend: {
      colors: {
        'rust-color': 'var(--rust-color)',
        'dark-bg': 'var(--dark-bg)',
        'light-text': 'var(--light-text)',
        'accent-color': 'var(--accent-color)',
      },
    },
  },
  plugins: [],
} 