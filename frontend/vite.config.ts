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
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
});
