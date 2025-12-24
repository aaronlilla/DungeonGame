/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Game theme colors
        game: {
          bg: '#0a0908',
          card: '#1a1614',
          surface: '#231e1a',
          border: '#3d3428',
          'border-light': '#5a4a3a',
        },
        gold: {
          DEFAULT: '#c9a227',
          light: '#e6c84a',
          dark: '#9a7a1c',
        },
        accent: {
          arcane: '#9966cc',
          blue: '#3498db',
          green: '#2ecc71',
          red: '#e74c3c',
          poison: '#50c878',
        },
        tank: {
          DEFAULT: '#4a9eff',
          light: '#7ab8ff',
          dark: '#2563eb',
        },
        healer: {
          DEFAULT: '#4ade80',
          light: '#86efac',
          dark: '#22c55e',
        },
        dps: {
          DEFAULT: '#f87171',
          light: '#fca5a5',
          dark: '#dc2626',
        },
      },
      fontFamily: {
        display: ['Cinzel', 'Georgia', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-gold': '0 0 20px rgba(201, 162, 39, 0.3)',
        'glow-arcane': '0 0 20px rgba(153, 102, 204, 0.3)',
        'glow-tank': '0 0 20px rgba(74, 158, 255, 0.3)',
        'glow-healer': '0 0 20px rgba(74, 222, 128, 0.3)',
        'glow-dps': '0 0 20px rgba(248, 113, 113, 0.3)',
        'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        'game-card': '0 4px 20px rgba(0, 0, 0, 0.5), inset 0 1px 0 rgba(255, 240, 200, 0.04)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px currentColor' },
          '100%': { boxShadow: '0 0 20px currentColor' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
