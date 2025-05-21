import Phaser from 'phaser';
import { createGameWorld } from 'shared/src/ecs/world';
import { createMovementSystem } from 'shared/src/ecs/systems/movement';
import { createGravitySystem } from 'shared/src/ecs/systems/gravity';
import { createCleanupSystem } from 'shared/src/ecs/systems/cleanup';
import { createCollisionSystem } from 'shared/src/ecs/systems/collision';
import { createRenderSystem } from '../render/renderSystem';
import { GameObjectManager } from '../render/objectManager';
import GameManager from '../game';

export class GameScene extends Phaser.Scene {
  private objectManager = new GameObjectManager(this);
  private world = createGameWorld();
  private gameManager = new GameManager(this, this.world);
  private movementSystem = createMovementSystem();
  private cleanupSystem = createCleanupSystem(-200, 2000, -200, 1100);
  private gravitySystem = createGravitySystem();
  private collisionSystem = createCollisionSystem();
  private renderSystem = createRenderSystem(this, this.objectManager);

  constructor() {
    super('game');
  }

  preload() {
    this.load.text('gravityShaderFragment', 'src/shaders/gravity.frag');
  }

  create() {
    this.gameManager.startGame();
  }

  update(time: number, deltaMs: number) {
    this.world.time = time;
    this.world.delta = deltaMs;
    this.movementSystem(this.world);
    this.gravitySystem(this.world);
    this.collisionSystem(this.world);
    this.cleanupSystem(this.world);
    this.renderSystem(this.world);
  }
}
