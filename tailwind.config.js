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
        // SIRAQ Premium Apple-Inspired Light Green Colour System
        siraq: {
          bg: '#FFFFFF',              // Primary Background: Pure White
          bgSubtle: '#F5F9F5',        // Secondary Background: Very Light Greenish White
          primaryGreen: '#A8CFAE',    // Primary Green: Soft Sage Green
          secondaryGreen: '#DDF1DF',  // Secondary Green: Light Mint Green
          accentGreen: '#477D55',     // Accent Green: Premium Forest Green
          yellow: '#F5D76E',          // Yellow Accent: Soft Premium Yellow
          yellowHover: '#ECD063',     // Yellow Hover
          sky: '#B9DDF2',             // Sky Blue Accent: Light Sky Blue
          skyDark: '#5E9EC4',         // Sky Dark Text
          text: '#25352B',            // Text: Deep Greenish Charcoal
          textMuted: '#556B5D',       // Muted Text
          border: '#DDF1DF',          // Mint Border
          borderDark: '#C2E0C7',      // Slightly deeper border
        },
        // Mapped tokens for consistent system styling
        accent: '#F5D76E',
        forest: '#477D55',
        sage: '#A8CFAE',
        mint: '#DDF1DF',
        charcoal: '#25352B',
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
        'siraq-card': '0 4px 20px -2px rgba(37, 53, 43, 0.05)',
        'siraq-hover': '0 12px 32px -4px rgba(37, 53, 43, 0.08)',
        'siraq-modal': '0 25px 50px -12px rgba(37, 53, 43, 0.15)',
        'yellow-pill': '0 2px 10px rgba(245, 215, 110, 0.4)',
      },
      borderRadius: {
        'siraq': '18px',
        'siraq-lg': '24px',
        'siraq-xl': '32px',
      },
    },
  },
  plugins: [],
};
