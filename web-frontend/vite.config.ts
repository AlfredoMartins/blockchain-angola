import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from "path"

import dotenv from "dotenv";
dotenv.config();

// https://vitejs.dev/config/
export default /* defineConfig */ ({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    }
  },
  server: {
    port: 3007,
    proxy: {
      '/api/committee/auth-web': {
        target: 'http://localhost:3010/',
        changeOrigin: true,
      }
    }
  },
  define: {
    'process.env': process.env,
  }, optimizeDeps: {
    include: ['js-cookie'],
  }, test: {
    globals: true,
    environment: 'jsdom',
    css: true,
    setupFiles: './src/tests/setup.ts',
    reporters: ['html']
  }
})
