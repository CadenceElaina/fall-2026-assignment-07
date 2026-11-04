import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

const backendHost = process.env.VITE_API_HOST ?? 'http://localhost:8080'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: backendHost,
        changeOrigin: backendHost !== 'http://localhost:8080',
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
})
