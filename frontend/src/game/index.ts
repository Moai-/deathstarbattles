import Phaser from 'phaser';
import { GameScene } from './gameScene';
import { BASE_HEIGHT, BASE_WIDTH } from 'shared/src/consts';
import { MusicScene } from './musicScene';

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
  scene: [GameScene, MusicScene],
  roundPixels: true,
  physics: { default: 'arcade' },
};

let game: Phaser.Game | null = null;

export const createGame = () => {
  game = new Phaser.Game(config);
};

export const destroyGame = () => {
  if (game) {
    getMainScene()?.destroy();
    game.destroy(true);
    game = null;
  }
};

export const getGame = () => game;

export const getMainScene = () => {
  if (game) {
    return game.scene.getScene('game')! as GameScene;
  }
  return null;
};
