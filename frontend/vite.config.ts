import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  base: '/deathstarbattles/',
  resolve: {
    alias: {
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
    minify: false,
    sourcemap: true,
  },
});
