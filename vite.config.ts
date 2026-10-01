import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

// base нужен для GitHub Pages (сайт живёт в подпапке /<repo>/).
// Локально и в превью оставляем корень.
export default defineConfig({
  plugins: [react()],
  base: process.env.GITHUB_ACTIONS ? '/greenapi-whatsapp-chat/' : '/',
  test: {
    environment: 'node',
    globals: true,
  },
})
