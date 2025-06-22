import Phaser from 'phaser';
import { createGameWorld } from 'shared/src/ecs/world';
import { BASE_HEIGHT, BASE_WIDTH, HIDDEN_BOUNDARY } from 'shared/src/consts';
import { createMovementSystem } from 'shared/src/ecs/systems/movement';
import { createGravitySystem } from 'shared/src/ecs/systems/gravity';
import { createCleanupSystem } from 'shared/src/ecs/systems/cleanup';
import { createCollisionSystem } from 'shared/src/ecs/systems/collision';
import { createRenderSystem } from '../render/renderSystem';
import { GameObjectManager } from '../render/objectManager';
import GameManager from './gameManager';
import { resetWorld } from 'bitecs';
import { gameBus, GameEvents } from 'src/util';
import { makeId } from './util';

const bMin = 0 - HIDDEN_BOUNDARY;
const bxMax = BASE_WIDTH + HIDDEN_BOUNDARY;
const byMax = BASE_HEIGHT + HIDDEN_BOUNDARY;

export class GameScene extends Phaser.Scene {
  private objectManager = new GameObjectManager(this);
  private world = createGameWorld();
  private gameManager = new GameManager(this, this.world, this.objectManager);
  private movementSystem = createMovementSystem();
  private cleanupSystem = createCleanupSystem(
    bMin,
    bxMax,
    bMin,
    byMax,
    this.gameManager.onCleanup.bind(this.gameManager),
  );
  private gravitySystem = createGravitySystem();
  private collisionSystem = createCollisionSystem(
    this.gameManager.onCollision.bind(this.gameManager),
  );
  private renderSystem = createRenderSystem(this, this.objectManager);

  private unique = makeId();

  constructor() {
    super('game');
    console.log('game %s created', this.unique);
  }

  preload() {
    //this.load.text('gravityShaderFragment', 'src/shaders/gravity.frag');
    this.load.audio('genericHit', '/assets/genhit.ogg');
    this.load.audio('stationHit', '/assets/stationhit.ogg');
    this.load.audio('laserShot', '/assets/lasershot.ogg');
    this.load.audio('songLoop', '/assets/songloop.ogg');
  }

  create() {
    gameBus.on(GameEvents.START_GAME, (config) => {
      console.log('starting game', this.unique);
      this.gameManager.startGame(config);
    });
    gameBus.emit(GameEvents.SCENE_LOADED);
    this.sound.play('songLoop', {
      loop: true,
      volume: 0.1,
    });
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

  destroy() {
    // flushRemovedEntities(this.world);
    resetWorld(this.world);
    this.gameManager.destroy();
    gameBus.off(GameEvents.START_GAME);
    gameBus.off(GameEvents.ANGLE_POWER_GAME);
    gameBus.off(GameEvents.ANGLE_POWER_UI);
    gameBus.off(GameEvents.END_TURN);
    gameBus.off(GameEvents.OTHER_ACTION_UI);
    gameBus.emit(GameEvents.GAME_REMOVED);
  }
}
