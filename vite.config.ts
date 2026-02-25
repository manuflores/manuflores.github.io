import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

const repoName = process.env.GITHUB_REPOSITORY?.split('/')[1] ?? ''
const isUserPage = repoName.endsWith('.github.io')
const base = process.env.GITHUB_ACTIONS
  ? isUserPage
    ? '/'
    : `/${repoName}/`
  : '/'

export default defineConfig({
  base,
  plugins: [react()],
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') },
  },
})
