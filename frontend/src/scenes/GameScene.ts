import Phaser from 'phaser';
import { getWelcomeMessage } from 'shared/src/hello';

export class GameScene extends Phaser.Scene {
  constructor() {
    super('game');
  }

  preload() {
    // Load assets
  }

  create() {
    console.log(getWelcomeMessage());
    // Initialize world, graphics, ECS
  }

  update(time: number, delta: number) {
    // Run ECS simulation or input handling
  }
}
