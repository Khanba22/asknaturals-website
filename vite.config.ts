import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: path.resolve(__dirname, 'frontend'),
  publicDir: path.resolve(__dirname, 'frontend/public'),
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend'),
    },
  },
  build: {
    outDir: path.resolve(__dirname, 'assets'),
    emptyOutDir: true,
    sourcemap: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'frontend/entrypoints/app.tsx'),
      output: {
        entryFileNames: 'app.js',
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some((n) => n.endsWith('.css'))) {
            return 'app.css';
          }
          return '[name][extname]';
        },
      },
    },
  },
});
