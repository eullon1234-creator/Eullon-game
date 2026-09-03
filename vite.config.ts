import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Garante que caminhos de CSS/JS funcionem perfeitamente no GitHub Pages
  server: {
    watch: {
      ignored: ['**/release/**', '**/dist/**'],
    },
  },
})
