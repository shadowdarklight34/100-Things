/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        cinzel: ['"Cinzel"', 'serif'],
        sans: ['"Inter"', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#fffaf0',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
          shimmer: '#f7d382',
          glow: '#ffbe53',
        },
        obsidian: {
          950: '#030206',
          900: '#07060a',
          850: '#0c0a10',
          800: '#14111b',
        }
      },
      animation: {
        'pulse-subtle': 'pulseSlow 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 8s linear infinite',
        'float-slow': 'floatSlow 20s linear infinite',
      },
      keyframes: {
        pulseSlow: {
          '0%, 100%': { opacity: '0.95', transform: 'scale(1)' },
          '50%': { opacity: '1', transform: 'scale(1.008)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        }
      }
    },
  },
  plugins: [],
}

