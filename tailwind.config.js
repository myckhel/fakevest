import forms from '@tailwindcss/forms';

// Github-like primary brand color
const primaryColor = '#0969da';

module.exports = {
  content: [
    './resources/**/*.blade.php',
    './resources/**/*.js',
    './resources/**/*.ts',
    './resources/**/*.tsx',
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Noto Sans',
          'Helvetica',
          'Arial',
          'sans-serif',
          'Apple Color Emoji',
          'Segoe UI Emoji',
        ],
      },
      colors: {
        primary: {
          DEFAULT: primaryColor,
          50: '#f0f7ff',
          100: '#e0f1ff',
          200: '#b7ddff',
          300: '#79bbff',
          400: '#3498ff',
          500: '#0969da', // GitHub primary color
          600: '#0559ca',
          700: '#044289',
          800: '#033578',
          900: '#032f62',
        },
        github: {
          canvas: '#ffffff',
          canvas_subtle: '#f6f8fa',
          canvas_inset: '#f6f8fa',
          border_default: '#d0d7de',
          border_muted: '#d8dee4',
          neutral: {
            muted: 'rgba(175, 184, 193, 0.2)',
            subtle: '#6e7781',
            emphasis: '#24292f',
          },
          accent: {
            fg: '#0969da',
            emphasis: '#0969da',
            muted: 'rgba(84, 174, 255, 0.4)',
            subtle: '#ddf4ff',
          },
          success: {
            fg: '#2da44e',
            emphasis: '#2da44e',
            muted: 'rgba(74, 194, 107, 0.4)',
            subtle: '#dafbe1',
          },
          attention: {
            fg: '#bf8700',
            emphasis: '#bf8700',
            muted: 'rgba(212, 167, 44, 0.4)',
            subtle: '#fff8c5',
          },
          danger: {
            fg: '#d73a49',
            emphasis: '#d73a49',
            muted: 'rgba(255, 129, 130, 0.4)',
            subtle: '#ffebe9',
          },
        },
      },
      // Add backdrop blur utilities
      backdropBlur: {
        xs: '2px',
      },
      // Add glass effect utilities
      backgroundOpacity: {
        85: '0.85',
        90: '0.9',
        95: '0.95',
        98: '0.98',
      },
      boxShadow: {
        'github-sm': '0 1px 0 rgba(27, 31, 36, 0.04)',
        github: '0 1px 3px rgba(27, 31, 36, 0.12)',
        'github-md': '0 3px 6px rgba(140, 149, 159, 0.15)',
        'github-lg': '0 8px 24px rgba(140, 149, 159, 0.2)',
        'github-xl': '0 12px 28px rgba(140, 149, 159, 0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-right': 'slideRight 1.5s ease-in-out infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        float: 'float 3s ease-in-out infinite',
      },
      keyframes: {
        slideRight: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [
    forms,
    // Add plugin for backdrop-blur
    function ({ addUtilities }) {
      const newUtilities = {
        '.backdrop-blur-xs': {
          'backdrop-filter': 'blur(2px)',
        },
        '.backdrop-blur-sm': {
          'backdrop-filter': 'blur(4px)',
        },
        '.backdrop-blur': {
          'backdrop-filter': 'blur(8px)',
        },
        '.backdrop-blur-md': {
          'backdrop-filter': 'blur(12px)',
        },
        '.backdrop-blur-lg': {
          'backdrop-filter': 'blur(16px)',
        },
        '.backdrop-blur-xl': {
          'backdrop-filter': 'blur(24px)',
        },
        '.backdrop-blur-2xl': {
          'backdrop-filter': 'blur(40px)',
        },
        '.backdrop-blur-3xl': {
          'backdrop-filter': 'blur(64px)',
        },
        '.glass': {
          background: 'rgba(255, 255, 255, 0.8)',
          'backdrop-filter': 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.3)',
          'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.05)',
        },
        '.glass-dark': {
          background: 'rgba(22, 27, 34, 0.8)',
          'backdrop-filter': 'blur(12px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          'box-shadow': '0 4px 6px rgba(0, 0, 0, 0.2)',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
