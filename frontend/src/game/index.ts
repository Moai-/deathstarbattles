import Phaser from 'phaser';
import { GameScene } from './gameScene';
import { BASE_HEIGHT, BASE_WIDTH } from 'shared/src/consts';
import { ResourceScene } from './resourceScene';
import { gameBus, GameEvents } from 'src/util';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  backgroundColor: '#000000',
  width: BASE_WIDTH,
  height: BASE_HEIGHT,
  parent: 'phaser-root',
  scale: {
    mode: Phaser.Scale.ScaleModes.HEIGHT_CONTROLS_WIDTH,
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [ResourceScene, GameScene],
  roundPixels: true,
  physics: { default: 'arcade' },
};

declare global {
  interface Window {
    __PHASER_GAME__: Phaser.Game | null;
  }
}

window.__PHASER_GAME__ = window.__PHASER_GAME__ || null;

export const getGame = (): Phaser.Game | null => window.__PHASER_GAME__;

export const createGame = () =>
  new Promise<void>((resolve) => {
    if (!window.__PHASER_GAME__) {
      gameBus.on(GameEvents.GAME_LOADED, () => {
        gameBus.off(GameEvents.GAME_LOADED);
        resolve();
      });
      window.__PHASER_GAME__ = new Phaser.Game(config);
    } else {
      console.log(
        'attempted to create game when previous game was not destroyed',
      );
      resolve();
    }
  });

export const destroyGame = () => {
  const game = getGame();
  if (game) {
    getMainScene()?.destroy();
    game.destroy(true);
    window.__PHASER_GAME__ = null;
  }
};

export const getMainScene = () => {
  const game = getGame();
  if (game) {
    return game.scene.getScene('GameScene')! as GameScene;
  }
  return null;
};

export const stopMainScene = () => {
  return new Promise<void>((resolve) => {
    const scene = getMainScene();
    if (scene) {
      gameBus.on(GameEvents.GAME_REMOVED, () => {
        gameBus.off(GameEvents.GAME_REMOVED);
        resolve();
      });
      scene.scene.stop();
      scene.destroy();
    } else {
      resolve();
    }
  });
};

export const startMainScene = () => {
  const scene = getMainScene();
  if (scene) {
    scene.scene.start();
  }
};
