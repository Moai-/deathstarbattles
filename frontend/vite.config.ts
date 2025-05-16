import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  root: '.',
  resolve: {
    alias: {
      shared: path.resolve(__dirname, '../shared')
    }
  },
  server: {
    open: true,
  },
  build: {
    outDir: '../dist/frontend',
    emptyOutDir: true,
  }
});
