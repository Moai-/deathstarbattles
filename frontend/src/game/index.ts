import Phaser from 'phaser';
import { GameScene } from './gameScene';
import { BASE_HEIGHT, BASE_WIDTH } from 'shared/src/consts';
import { ResourceScene } from './resourceScene';

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

export const createGame = () => {
  if (!window.__PHASER_GAME__) {
    window.__PHASER_GAME__ = new Phaser.Game(config);
  } else {
    console.log(
      'attempted to create game when previous game was not destroyed',
    );
  }
};

export const destroyGame = () => {
  const game = getGame();
  if (game) {
    console.log('destroying game');
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
  const scene = getMainScene();
  if (scene) {
    console.log('scene stop');
    scene.scene.stop();
    scene.destroy();
  }
};

export const startMainScene = () => {
  const scene = getMainScene();
  if (scene) {
    console.log('scene start');
    scene.create();
    scene.scene.start();
  }
};
