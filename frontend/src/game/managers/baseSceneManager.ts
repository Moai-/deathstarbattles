import { GameWorld } from 'shared/src/ecs/world';
import { GameObjectManager } from 'src/render/objectManager';
import { FiringIndicatorHandler } from './handlers/firingIndicatorHandler';
import { PlayerInputHandler } from './handlers/playerInputHandler';
import { ProjectileManager } from './projectileManager';
import { CollisionHandler } from './handlers/collisionHandler';
import {
  GameState,
} from 'shared/src/types';
import {
  noop,
} from 'shared/src/utils';
import { SimManager } from 'shared/src/ai/simulation/manager';
import { BaseScene } from '../scenes/baseScene';

type ListenerConfig = {
  cleanupCallback: () => void,
  singleCleanupCallback: (eid?: number) => void,
  projectileDestroyedCallback: (eid: number) => void;
  targetDestroyedCallback: (eid: number) => void;
  getTargetIdCallback: () => number;
  anglePowerListener: (angle: number, power: number) => void;
  onEndTurnCallback: () => void;
}

const defaultConfig: ListenerConfig = {
  cleanupCallback: () => {},
  singleCleanupCallback: () => {},
  projectileDestroyedCallback: () => {},
  targetDestroyedCallback: () => {},
  getTargetIdCallback: () => 0,
  anglePowerListener: () => {},
  onEndTurnCallback: () => {},
}

const getListenerConfig: (incomingConfig?: Partial<ListenerConfig>) => ListenerConfig = (inc = {}) => {
  return {
    ...defaultConfig,
    ...inc,
  }
}

// This is any manager that works with a game scene.
// It creates all the handlers and variables that a scene might want.
// However, it does not actually run a game. 
export class BaseSceneManager {
  // globals
  protected scene: BaseScene;
  protected world: GameWorld;

  // game components
  protected indicator: FiringIndicatorHandler;
  protected inputHandler: PlayerInputHandler;
  protected collisionHandler: CollisionHandler;
  protected projectileManager: ProjectileManager;
  protected objectManager: GameObjectManager;
  protected simManager: SimManager;

  // game state
  protected active = true;

  constructor(
    scene: BaseScene,
    world: GameWorld,
    objectManager: GameObjectManager,
  ) {
    this.scene = scene;
    this.world = world;
    this.objectManager = objectManager;
    this.indicator = new FiringIndicatorHandler(scene);
    this.projectileManager = new ProjectileManager(world);
    this.simManager = new SimManager();
    this.collisionHandler = new CollisionHandler(world, scene);
    this.inputHandler = new PlayerInputHandler();
  }

  create() {
    this.indicator.create();
    this.inputHandler.create();
    this.setUpListeners();
    this.active = true;
  }

  destroy() {
    this.clearListeners();
    this.indicator.destroy();
    this.simManager.destroy();
    this.inputHandler.destroy();
    this.projectileManager.destroy();
    this.active = false;
  }

  onCollision(eid1: number, eid2: number, wasDestroyed: boolean) {
    return this.collisionHandler.handleCollision(eid1, eid2, wasDestroyed);
  }

  onCleanup(eid: number) {
    this.projectileManager.removeProjectile(eid);
  }

  ready() {
    this.active = true;
  }

  protected setUpListeners(conf?: Partial<ListenerConfig>) {
    const c = getListenerConfig(conf);
    this.projectileManager.setCleanupCallback(c.cleanupCallback);
    this.projectileManager.setSingleCleanupCallback(c.singleCleanupCallback);
    this.collisionHandler.setProjectileDestroyedCallback(c.projectileDestroyedCallback);
    this.collisionHandler.setTargetDestroyedCallback(c.targetDestroyedCallback);
    this.inputHandler.setOnEndTurnCallback(c.onEndTurnCallback);
    this.indicator.setGetTargetIdCallback(c.getTargetIdCallback);
    this.indicator.setAnglePowerListener((angle, power) => 
      this.inputHandler.setAnglePower(angle, power)
    );
  }

  protected clearListeners() {
    this.projectileManager.setCleanupCallback(noop);
    this.projectileManager.setSingleCleanupCallback(noop);
    this.collisionHandler.setProjectileDestroyedCallback(noop);
    this.collisionHandler.setTargetDestroyedCallback(noop);
    this.inputHandler.setOnEndTurnCallback(noop);
    this.indicator.setAnglePowerListener(noop);
    this.indicator.setGetTargetIdCallback(() => 0);
  }

  getGameState() {
    return {
      lastTurnShots: this.world.movements,
    } as GameState;
  }
}
