import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/check-status': 'http://localhost:3000',
      '/telegram-proxy': 'http://localhost:3000'
    }
  }
})
