import Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1800,
  height: 900,
  scene: [GameScene],
  physics: { default: 'arcade' },
};

new Phaser.Game(config);
