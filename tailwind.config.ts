import type { Config } from 'tailwindcss'
import colors from 'tailwindcss/colors'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"TASA Orbiter"', 'system-ui', 'sans-serif'],
      },
      colors: {
        surface: {
          light: '#FAF9F7',
          dark: '#121212',
          'card-light': '#FFFFFF',
          'card-dark': '#1a1a1a',
        },
        primary: {
          light: '#2A2F3D',
          dark: colors.neutral[100],
        },
        secondary: {
          light: '#6B7485',
          dark: colors.neutral[400],
        },
        accent: {
          light: '#4169E1',
          dark: colors.emerald[400],
        },
        border: {
          light: '#C8CDD8',
          dark: colors.neutral[700],
        },
      },
    },
  },
  plugins: [],
} satisfies Config
