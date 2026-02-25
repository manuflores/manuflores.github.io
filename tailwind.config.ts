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
          light: colors.stone[900],
          dark: colors.neutral[100],
        },
        secondary: {
          light: colors.stone[500],
          dark: colors.neutral[400],
        },
        accent: {
          light: colors.emerald[600],
          dark: colors.emerald[400],
        },
        border: {
          light: colors.stone[200],
          dark: colors.neutral[700],
        },
      },
    },
  },
  plugins: [],
} satisfies Config
