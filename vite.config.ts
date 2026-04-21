import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  define: {
    global: 'globalThis',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    host: true,        // clave → expone en 0.0.0.0
    port: 5173,       // puerto específico
    strictPort: true,  // evita que cambie a otro puerto si está ocupado
  }
})