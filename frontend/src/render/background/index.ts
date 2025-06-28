import { noop } from 'shared/src/utils';
import { BG_TEXTURE } from './constants';
import { generateBackgroundShards } from './shardTunnel';
import { generateBackgroundStars } from './stars';
import { Backgrounds } from 'shared/src/types';

export { Backgrounds };
export const clearBackground = (scene: Phaser.Scene) => {
  if (scene.textures.exists(BG_TEXTURE)) {
    scene.textures.remove(BG_TEXTURE);
  }
};

export const generateBackground = (
  bgType: Backgrounds,
  scene: Phaser.Scene,
) => {
  switch (bgType) {
    case Backgrounds.STARS:
      return generateBackgroundStars(scene);
    case Backgrounds.SHARDS:
      return generateBackgroundShards(scene);
    default:
      return noop;
  }
};
