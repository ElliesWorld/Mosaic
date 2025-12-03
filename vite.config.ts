import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import electron from 'vite-plugin-electron'
import renderer from 'vite-plugin-electron-renderer'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    electron([
      {
        // Main process entry file
        entry: 'src/Main/main.ts',
      },
      {
        // Preload scripts
        entry: 'src/Preload/preload.ts',
        onstart(options) {
          options.reload()
        },
      },
    ]),
    renderer(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/Interface/Components'),
      '@styles': path.resolve(__dirname, './src/Styles/'),
      '@types': path.resolve(__dirname, './src/Types'),
    },
  },
  server: {
    port: 5173,
  },
})