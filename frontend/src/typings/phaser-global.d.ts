/**
 * Custom Phaser build attaches the library to global.Phaser (UMD).
 * Reference the official phaser types and expose Phaser as a global so that
 * code using the custom chunks (phaser-core + phaser-extras) is typed.
 */
/// <reference types="phaser" />

declare global {
  const Phaser: typeof import('phaser');
}

export {};
