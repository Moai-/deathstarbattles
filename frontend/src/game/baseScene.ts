import Phaser from 'phaser';
import { createGameWorld } from 'shared/src/ecs/world';
import {
  createCollisionSystem,
  createGravitySystem,
  createMovementSystem,
  createPathTrackerSystem,
  createPolarJetSystem,
} from 'shared/src/ecs/systems';
import { createRenderObservers, createRenderSystem } from '../render/renderSystem';
import { GameObjectManager } from '../render/objectManager';
import { gameBus, GameEvents } from 'src/util';
import { clearBackground } from 'src/render/background';
import { getSoundManager } from './resourceScene';
import { drawPathListener } from 'src/util/debug';
import { resetWorld } from 'bitecs';
import { FxManager } from './fxManager';

export class BaseScene extends Phaser.Scene {
  public world = createGameWorld();
  public debug = false;
  public fxManager = new FxManager(this);

  protected objectManager = new GameObjectManager(this);
  protected unsubRenderObservers = createRenderObservers(this.world, this.objectManager);
  protected movementSystem = createMovementSystem();
  protected pathTrackerSystem = createPathTrackerSystem();
  protected gravitySystem = createGravitySystem();
  protected polarJetSystem = createPolarJetSystem();
  protected collisionSystem = createCollisionSystem();
  protected renderSystem = createRenderSystem(this, this.objectManager);

  constructor(sceneKey: string) {
    super({ key: sceneKey, active: false });
    this.world.debug = this.debug;
  }

  create() {
    this.fxManager.create();
    drawPathListener(this);
  }

  update(time: number, deltaMs: number) {
    this.world.time = time;
    this.world.delta = deltaMs;
    this.movementSystem(this.world);
    this.pathTrackerSystem(this.world);
    this.gravitySystem(this.world);
    this.polarJetSystem(this.world);
    this.collisionSystem(this.world);
    this.renderSystem(this.world);
  }

  destroy() {
    getSoundManager(this).stopAllSounds('effects');
    resetWorld(this.world);
    this.unsubRenderObservers();
    this.fxManager.destroy();
    this.objectManager.destroy();
    clearBackground(this);
    gameBus.off(GameEvents.START_GAME);
    gameBus.off(GameEvents.DEBUG_DRAW_PATH);
    gameBus.emit(GameEvents.GAME_REMOVED);
  }
}
