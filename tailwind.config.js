/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core Apple Minimalist Palette
        apple: {
          white: '#FFFFFF',
          bg: '#FAFAFC',
          surface: '#F5F5F7',
          border: '#E5E5E7',
          borderLight: '#F2F2F7',
          text: '#1D1D1F',
          subtext: '#6E6E73',
          caption: '#86868B',
        },
        // Specified Primary Brand Colors
        siraq: {
          yellow: '#FFD43B',
          yellowHover: '#F5C724',
          yellowLight: '#FFF9DB',
          sky: '#87CEEB',
          skyDark: '#5FAED1',
          skyLight: '#F0F9FF',
          skySoft: '#E0F2FE',
        },
        // Mapped legacy tokens for seamless backward compatibility with new Apple theme
        accent: '#FFD43B',
        neon: '#87CEEB',
        charcoal: '#1D1D1F',
        space: '#F5F5F7',
        slateSoft: '#6E6E73',
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          'Inter',
          'system-ui',
          'sans-serif',
        ],
        display: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Display"',
          'Poppins',
          'Inter',
          'sans-serif',
        ],
      },
      boxShadow: {
        'apple-sm': '0 1px 3px 0 rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.04)',
        'apple-card': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'apple-hover': '0 12px 32px -4px rgba(0, 0, 0, 0.08)',
        'apple-modal': '0 25px 50px -12px rgba(0, 0, 0, 0.15)',
        'yellow-glow': '0 4px 20px rgba(255, 212, 59, 0.35)',
        'sky-glow': '0 4px 20px rgba(135, 206, 235, 0.35)',
        glow: '0 4px 20px rgba(255, 212, 59, 0.3)',
        glass: '0 8px 30px rgba(0, 0, 0, 0.04)',
      },
      borderRadius: {
        'apple-sm': '10px',
        'apple': '16px',
        'apple-lg': '22px',
        'apple-xl': '28px',
      },
    },
  },
  plugins: [],
};
