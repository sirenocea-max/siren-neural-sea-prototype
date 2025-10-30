import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: process.env.PORT || 5173,
  },
  preview: {
    host: '0.0.0.0',
    port: process.env.PORT || 4173,
    allowedHosts: true // This allows all hosts
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
})
