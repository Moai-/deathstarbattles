import { noop } from 'shared/src/utils';
import { BG_TEXTURE } from './constants';
import { generateBackgroundShards } from './shardTunnel';
import { generateBackgroundStars } from './stars';
import { Backgrounds } from 'shared/src/types';
import { generateDeepSpace } from './deepspace';
import { generateNebular } from './nebular';

export { Backgrounds };

/** Destroy any scene object using the background texture, then remove the texture. */
const destroyBackgroundImage = (scene: Phaser.Scene) => {
  const list = scene.children.getAll();
  for (let i = list.length - 1; i >= 0; i--) {
    const child = list[i] as Phaser.GameObjects.Image | undefined;
    if (child?.texture?.key === BG_TEXTURE) {
      child.destroy();
      break;
    }
  }
};

export const clearBackground = (scene: Phaser.Scene) => {
  destroyBackgroundImage(scene);
  if (scene.textures.exists(BG_TEXTURE)) {
    scene.textures.remove(BG_TEXTURE);
  }
};

export const setEditorBackground = (scene: Phaser.Scene, bgType: Backgrounds) => {
  clearBackground(scene);
  if (bgType !== Backgrounds.NONE) {
    generateBackground(bgType, scene);
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
    case Backgrounds.DEEPSPACE:
      return generateDeepSpace(scene);
    case Backgrounds.NEBULAR:
      return generateNebular(scene);
    default:
      return noop;
  }
};
