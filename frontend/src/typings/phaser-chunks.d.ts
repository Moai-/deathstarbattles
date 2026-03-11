/**
 * Declarations for the custom Phaser chunk modules.
 * They are side-effect-only: they attach to global.Phaser at runtime.
 * Resolved at build time by Vite alias to vendor/phaser-custom/dist/*.js
 */
declare module 'phaser-core' {}
declare module 'phaser-extras' {}
