import Phaser from 'phaser';
import { createGameWorld } from 'shared/src/ecs/world';
import { createMovementSystem } from 'shared/src/ecs/systems/movement';
import { createGravitySystem } from 'shared/src/ecs/systems/gravity';
import { createBoundarySystem } from 'shared/src/ecs/systems/boundary';
import { createRenderSystem } from '../render/renderSystem';
import { createDeathStar, fireProjectile } from '../entities/deathStar';
import { GameObjectManager } from '../render/objectManager';
import { removeEntity } from 'bitecs';
import { createAsteroid } from '../entities/asteroid';
import drawGravityVisualizer from '../render/debug/drawGravityVisualizer';

export class GameScene extends Phaser.Scene {
  private objectManager = new GameObjectManager(this);
  private world = createGameWorld();
  private movementSystem = createMovementSystem();
  private boundarySystem = createBoundarySystem(-200, 2000, -200, 1100);
  private gravitySystem = createGravitySystem();
  private renderSystem = createRenderSystem(this, this.objectManager);

  constructor() {
    super('game');
  }

  preload() {
    this.load.text('gravityShaderFragment', 'src/shaders/gravity.frag');
  }

  create() {
    const playerStar = createDeathStar(this.world, 200, 300, 0xff0000);
    let playerProjectile = -1;
    createDeathStar(this.world, 600, 700, 0x00ff00);
    const ast1 = createAsteroid(this.world, 1000, 500, 40);
    const ast2 = createAsteroid(this.world, 950, 700, 30);
    drawGravityVisualizer(this, ast1);
    drawGravityVisualizer(this, ast2);

    // Listen for pointer clicks
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      this.objectManager.removeAllChildren();
      removeEntity(this.world, playerProjectile);
      const fromX = 200;
      const fromY = 300;
      const toX = pointer.worldX;
      const toY = pointer.worldY;
      console.log(toX, toY);
      const dx = toX - fromX;
      const dy = toY - fromY;
      const angle = Math.atan2(dy, dx);
      const speed = 100;

      playerProjectile = fireProjectile(this.world, playerStar, angle, speed);
    });
  }

  update(time: number, deltaMs: number) {
    this.world.time = time;
    this.world.delta = deltaMs;
    this.movementSystem(this.world);
    this.boundarySystem(this.world);
    this.gravitySystem(this.world);
    this.renderSystem(this.world);
  }
}
