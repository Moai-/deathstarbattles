import Phaser from 'phaser';
import { GameScene } from './scenes/gameScene';
const config = {
    type: Phaser.WEBGL,
    width: 1300,
    height: 900,
    scene: [GameScene],
    physics: { default: 'arcade' },
};
new Phaser.Game(config);
