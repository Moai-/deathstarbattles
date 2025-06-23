import { BG_TEXTURE } from './constants';

export * from './stars';

export const clearBackground = (scene: Phaser.Scene) => {
  scene.textures.remove(BG_TEXTURE);
};
