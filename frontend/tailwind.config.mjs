/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './styles/**/*.{css}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6B7B6E',
        secondary: '#000000',
        accent: '#C0C0C0'
      }
    },
  },
  plugins: [],
}


