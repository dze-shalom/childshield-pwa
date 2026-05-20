/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        syne: ['Syne', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
      },
      colors: {
        navy: { 950: '#040810', 900: '#080E1A', 800: '#0D1526', 700: '#111F35' },
        shield: { red: '#EF4444', amber: '#F59E0B', teal: '#10B981', blue: '#3B82F6' },
      },
      animation: {
        'pulse-red': 'pulse-red 2s infinite',
        'fade-up': 'fade-up 0.4s ease-out',
      },
      keyframes: {
        'pulse-red': {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(239,68,68,0.4)' },
          '50%': { boxShadow: '0 0 0 16px rgba(239,68,68,0)' },
        },
        'fade-up': {
          from: { opacity: '0', transform: 'translateY(16px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
