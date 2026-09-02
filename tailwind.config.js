/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gamer: {
          950: '#07090e',
          900: '#0b0f19',
          850: '#101726',
          800: '#161f33',
          750: '#1d2842',
          700: '#263353',
          600: '#384b73',
          500: '#4f699e',
          400: '#7592cf',
          300: '#a3b8e5',
          200: '#cfdbf5',
          100: '#edf2fc',
        },
        neon: {
          cyan: '#00f2fe',
          purple: '#9d4edd',
          pink: '#f72585',
          emerald: '#10b981',
          amber: '#f59e0b',
          blue: '#3a86ff',
          red: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      boxShadow: {
        'glow-cyan': '0 0 25px -5px rgba(0, 242, 254, 0.3)',
        'glow-purple': '0 0 25px -5px rgba(157, 78, 221, 0.35)',
        'glow-emerald': '0 0 25px -5px rgba(16, 185, 129, 0.3)',
        'glow-amber': '0 0 25px -5px rgba(245, 158, 11, 0.3)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.35)',
        'card-hover': '0 14px 40px rgba(0, 0, 0, 0.5), 0 0 20px rgba(99, 102, 241, 0.15)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%': { opacity: '0.6' },
          '100%': { opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
