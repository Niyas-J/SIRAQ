/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        charcoal: '#06070C',
        space: '#0F111A',
        accent: '#F9B234',
        neon: '#15F4EE',
        slateSoft: '#9CA5C2',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 20px 45px rgba(21,244,238,0.25)',
        glass: '0 25px 60px rgba(4,6,16,0.55)',
      },
    },
  },
  plugins: [],
};
