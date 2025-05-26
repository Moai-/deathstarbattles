import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  base: '/deathstarbattles/',
  resolve: {
    alias: {
      shared: path.resolve(__dirname, '../shared'),
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
