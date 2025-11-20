/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        neon: '#15F4EE',
        accent: '#F9B234',
      },
    },
  },
  plugins: [],
}

