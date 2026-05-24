import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5176,
    // report.html 重定向到 SPA，自动加上 page=presentation
    proxy: {
      '/report.html': {
        target: 'http://localhost:5176',
        rewrite: () => '/?page=presentation',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
