import Phaser from 'phaser';
import { createGameWorld } from 'shared/src/ecs/world';
import {
  createCleanupSystem,
  createCollisionResolverSystem,
  createCollisionSystem,
  createGravitySystem,
  createMovementSystem,
} from 'shared/src/ecs/systems';
import { createRenderSystem } from '../render/renderSystem';
import { GameObjectManager } from '../render/objectManager';
import GameManager from './gameManager';
import { resetWorld } from 'bitecs';
import { gameBus, GameEvents } from 'src/util';
import { clearBackground } from 'src/render/background';
import { getSoundManager } from './resourceScene';
import { makeId } from 'shared/src/utils';
// import { drawPathListener } from 'src/util/debug';

export class GameScene extends Phaser.Scene {
  private objectManager = new GameObjectManager(this);
  private world = createGameWorld();
  private gameManager = new GameManager(this, this.world, this.objectManager);
  private movementSystem = createMovementSystem();
  private cleanupSystem = createCleanupSystem(
    this.gameManager.onCleanup.bind(this.gameManager),
  );
  private gravitySystem = createGravitySystem();
  private collisionSystem = createCollisionSystem();
  private collisionResolverSystem = createCollisionResolverSystem(
    this.gameManager.onCollision.bind(this.gameManager),
  );
  private renderSystem = createRenderSystem(this, this.objectManager);

  private unique = makeId();

  constructor() {
    super({ key: 'GameScene', active: false });
    console.log('game %s created', this.unique);
  }

  create() {
    gameBus.on(GameEvents.START_GAME, (config) => {
      console.log('starting game', this.unique);
      this.gameManager.startGame(config);
    });
    this.gameManager.create();
    getSoundManager(this).playSound('songLoop');
    gameBus.emit(GameEvents.SCENE_LOADED);
    // drawPathListener(this);
  }

  update(time: number, deltaMs: number) {
    this.world.time = time;
    this.world.delta = deltaMs;
    this.movementSystem(this.world);
    this.gravitySystem(this.world);
    this.collisionSystem(this.world);
    this.collisionResolverSystem(this.world);
    this.cleanupSystem(this.world);
    this.renderSystem(this.world);
  }

  destroy() {
    // flushRemovedEntities(this.world);
    getSoundManager(this).stopAllSounds('effects');
    resetWorld(this.world);
    this.gameManager.destroy();
    this.objectManager.destroy();
    clearBackground(this);
    gameBus.off(GameEvents.START_GAME);
    gameBus.off(GameEvents.DEBUG_DRAW_PATH);
    gameBus.emit(GameEvents.GAME_REMOVED);
  }
}
