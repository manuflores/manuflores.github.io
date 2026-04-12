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
          light: '#ece9df',
          dark: '#121212',
          'card-light': '#f5f2e8',
          'card-dark': '#1a1a1a',
        },
        primary: {
          light: '#353b46',
          dark: colors.neutral[100],
        },
        secondary: {
          light: '#798798',
          dark: colors.neutral[400],
        },
        accent: {
          light: '#6b9fbb',
          dark: colors.emerald[400],
        },
        border: {
          light: '#d3e4ed',
          dark: colors.neutral[700],
        },
      },
    },
  },
  plugins: [],
} satisfies Config
