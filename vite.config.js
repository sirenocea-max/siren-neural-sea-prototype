import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 5173,
    host: true // Add this line to bind to all addresses
  },
  preview: {
    port: 4173,
    host: true // Add this line for production preview
  },
  base: './' // For deployment
})