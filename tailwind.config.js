/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium macOS-inspired palette
        'sky-accent': '#007AFF',
        'sky-accent-hover': '#0051D5',
        'sky-accent-light': '#5AC8FA',
        'sky-bg': 'rgba(255, 255, 255, 0.85)',
        'sky-bg-dark': 'rgba(28, 28, 30, 0.95)',
        'sky-bg-secondary': 'rgba(250, 250, 250, 0.8)',
        'sky-border': 'rgba(229, 229, 234, 0.6)',
        'sky-divider': 'rgba(209, 209, 214, 0.5)',
        'sky-text': '#1D1D1F',
        'sky-text-secondary': '#86868B',
        'sky-text-tertiary': '#C7C7CC',
        'sky-success': '#34C759',
        'sky-warning': '#FF9500',
        'sky-error': '#FF3B30',
        'sky-purple': '#AF52DE',
        'sky-teal': '#5AC8FA',
        'sky-indigo': '#5856D6',
        'sky-pink': '#FF2D55',
      },
      backdropBlur: {
        'sky': '60px',
        'sky-heavy': '100px',
        'sky-light': '40px',
      },
      borderRadius: {
        'sky': '12px',
        'sky-lg': '16px',
        'sky-xl': '20px',
        'sky-2xl': '24px',
      },
      boxShadow: {
        'sky': '0 8px 32px rgba(0, 0, 0, 0.08), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'sky-lg': '0 20px 60px rgba(0, 0, 0, 0.12), 0 2px 6px rgba(0, 0, 0, 0.06)',
        'sky-hover': '0 12px 40px rgba(0, 0, 0, 0.14), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'sky-inner': 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
        'sky-glow': '0 0 20px rgba(0, 122, 255, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2.5s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'bounce-subtle': 'bounceSubtle 1s ease-in-out',
        'glow': 'glow 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideLeft: {
          '0%': { transform: 'translateX(12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideRight: {
          '0%': { transform: 'translateX(-12px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.85', transform: 'scale(0.98)' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-4px)' },
        },
        glow: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(0, 122, 255, 0.2)' },
          '50%': { boxShadow: '0 0 30px rgba(0, 122, 255, 0.4)' },
        },
      },
      fontFamily: {
        'sf-pro': ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
        'sf-mono': ['SF Mono', 'Monaco', 'Consolas', 'Courier New', 'monospace'],
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
      },
    },
  },
  plugins: [],
}
