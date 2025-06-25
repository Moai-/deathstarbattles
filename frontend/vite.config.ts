import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  root: '.',
  base: '/',
  plugins: [react()],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      shared: path.resolve(__dirname, '../shared'),
      bitecs: path.resolve(__dirname, 'node_modules/bitecs'),
    },
  },
  server: {
    open: true,
    host: '0.0.0.0',
    port: 5173,
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
