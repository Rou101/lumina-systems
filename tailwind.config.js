/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        lumina: {
          base: '#050505', // Deep Void
          panel: '#111111',
          border: '#333333',
          cyan: '#00F0FF', // Cyber Cyan
          violet: '#7000FF', // Electric Violet
          fuchsia: '#FF00FF', // Hyper Fuchsia
          text: {
            primary: '#ededed',
            secondary: '#a1a1aa',
            muted: '#52525b',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 3s ease-in-out infinite alternate',
        'beam': 'beam 2s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(0, 240, 255, 0.2)' },
          '100%': { boxShadow: '0 0 50px rgba(0, 240, 255, 0.6), 0 0 100px rgba(112, 0, 255, 0.3)' },
        },
        beam: {
          '0%': { backgroundPosition: '-100%' },
          '100%': { backgroundPosition: '200%' },
        }
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0, 240, 255, 0.4)',
        'glow-fuchsia': '0 0 20px rgba(255, 0, 255, 0.4)',
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      }
    },
  },
  plugins: [],
}