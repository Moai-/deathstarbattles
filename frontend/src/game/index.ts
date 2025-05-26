import Phaser from 'phaser';
import { GameScene } from './gameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 1300,
  height: 900,
  parent: 'phaser-root',
  scene: [GameScene],
  physics: { default: 'arcade' },
};

let game: Phaser.Game | null = null;

export const createGame = () => {
  game = new Phaser.Game(config);
};

export const destroyGame = () => {
  if (game) {
    game.destroy(true);
    game = null;
  }
};

export const getGame = () => game;
