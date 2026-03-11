import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  root: '.',
  base: '/',
  plugins: [
    react(),
    visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      shared: path.resolve(__dirname, '../shared'),
      bitecs: path.resolve(__dirname, 'node_modules/bitecs'),
      phaser: path.resolve(__dirname, 'vendor/phaser-custom/dist/phaser-custom.js')
    },
  },
  server: {
    open: true,
    host: '0.0.0.0',
    port: 6173,
    fs: {
      // Always include the root itself, plus the shared folder
      allow: [path.resolve(__dirname), path.resolve(__dirname, '../shared')],
    },
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
