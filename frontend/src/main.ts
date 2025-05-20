import Phaser from 'phaser';
import { GameScene } from './scenes/gameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.WEBGL,
  width: 1800,
  height: 900,
  scene: [GameScene],
  physics: { default: 'arcade' },
};

new Phaser.Game(config);
