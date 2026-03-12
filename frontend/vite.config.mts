import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import path from 'path';

export default defineConfig({
  root: '.',
  base: '/',
  plugins: [
    react(),
    // Uncomment the below line to see a visualization of the relative chunks in the build
    // visualizer({
    //   filename: 'dist/stats.html',
    //   open: true,
    //   gzipSize: true,
    //   brotliSize: true
    // })
  ],
  resolve: {
    alias: {
      src: path.resolve(__dirname, 'src'),
      shared: path.resolve(__dirname, '../shared'),
      bitecs: path.resolve(__dirname, 'node_modules/bitecs'),
      'phaser-core': path.resolve(__dirname, 'vendor/phaser-custom/dist/phaser-core.js'),
      'phaser-extras': path.resolve(__dirname, 'vendor/phaser-custom/dist/phaser-extras.js'),
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
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          
          if (id.includes('vendor/phaser-custom/dist/phaser-core')) {
            return 'phaser-core';
          }

          if (id.includes('vendor/phaser-custom/dist/phaser-extras')) {
            return 'phaser-extras';
          }

          if (!id.includes('node_modules') && !id.includes('/src/') && !id.includes('/shared/')) {
            return;
          }

          if (id.includes('react-dom') || id.includes('/react/')) {
            return 'react-vendor';
          }

          if (
            id.includes('styled-components') ||
            id.includes('react-icons') ||
            id.includes('react-select')
          ) {
            return 'ui-vendor';
          }

          if (
            id.includes('seedrandom') ||
            id.includes('bitecs') ||
            id.includes('mitt')
          ) {
            return 'other-vendor';
          }


          if (
            id.includes('/src/game/') ||
            id.includes('/src/render/') ||
            id.includes('/src/shaders/') ||
            id.includes('/src/util/') ||
            id.includes('/src/utils/') ||
            id.includes('/src/scenarios/') ||
            id.includes('/src/ai/') ||
            id.includes('/src/content/') ||
            id.includes('/src/ecs/') ||
            id.includes('/src/entities/') ||
            id.includes('/src/simulation/')
          ) {
            return 'game-app';
          }

          if (
            id.includes('/src/ui/') ||
            id.includes('/src/editor/') ||
            id.includes('/src/hooks/') ||
            id.includes('/src/components/') ||
            id.includes('/src/main.tsx') ||
            id.includes('/src/App.tsx')
          ) {
            return 'ui-app';
          }
        }
      }
    }
  },
});
