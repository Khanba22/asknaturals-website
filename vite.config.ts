import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS_DIR = path.resolve(__dirname, 'assets');
const STAGING_DIR = path.resolve(__dirname, '.vite-staging');
const PUBLISH_FILES = ['app.js', 'app.css', 'app.js.map', 'app.css.map'];

function atomicReplace(src: string, dest: string) {
  const swap = `${dest}.swap`;
  fs.copyFileSync(src, swap);
  if (fs.existsSync(dest)) {
    fs.unlinkSync(dest);
  }
  fs.renameSync(swap, dest);
}

/** Publish built bundles atomically so watch rebuilds never serve a half-written app.js. */
function publishAssetsPlugin(): Plugin {
  return {
    name: 'publish-assets',
    closeBundle() {
      if (!fs.existsSync(ASSETS_DIR)) {
        fs.mkdirSync(ASSETS_DIR, { recursive: true });
      }

      for (const file of PUBLISH_FILES) {
        const src = path.join(STAGING_DIR, file);
        if (!fs.existsSync(src)) continue;
        atomicReplace(src, path.join(ASSETS_DIR, file));
      }
    },
  };
}

export default defineConfig({
  root: path.resolve(__dirname, 'frontend'),
  publicDir: path.resolve(__dirname, 'frontend/public'),
  plugins: [react(), tailwindcss(), publishAssetsPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'frontend'),
    },
  },
  build: {
    // Build into staging first; publish-assets swaps into assets/ when complete.
    // Keeps hero frames and other assets untouched during watch rebuilds.
    outDir: STAGING_DIR,
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
