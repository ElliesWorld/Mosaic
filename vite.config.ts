import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@types': path.resolve(__dirname, './src/Types'),
      '@styles': path.resolve(__dirname, './src/Styles'),
    },
  },
  server: {
    port: 5173,
    open: true, // Auto-open browser
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})