import { BG_TEXTURE } from './constants';

export * from './stars';

export const clearBackground = (scene: Phaser.Scene) => {
  if (scene.textures.exists(BG_TEXTURE)) {
    scene.textures.remove(BG_TEXTURE);
  }
};
