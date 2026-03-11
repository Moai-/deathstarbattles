import { GameWorld } from 'shared/src/ecs/world';
import { EntityRenderManager } from 'src/render/managers';
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
import { GHOST_SHOT_STEPS } from 'shared/src/consts';
import { BackgroundArtManager } from 'src/render/managers';

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
  // == globals == 
  // Reference to the currently running scene
  protected scene: BaseScene;
  // Reference to the currently active ECS world
  protected world: GameWorld;

  // == game components ==
  // Handler and renderer for the firing indicator
  protected indicator: FiringIndicatorHandler;
  // Handler for player input (TODO: probably worth rolling into firing indicator idk)
  protected inputHandler: PlayerInputHandler;
  // Handler for resolving collisions between projectiles and other objects
  protected collisionHandler: CollisionHandler;
  // Handler for keeping track of projectiles
  protected projectileManager: ProjectileManager;
  // Manager for all in-game object renders
  protected renderManager: EntityRenderManager;
  // Manager for the webworker that runs shot simulations
  protected simManager: SimManager;
  // Manager for background art
  protected backgroundArtManager: BackgroundArtManager

  // == game state ==
  // Whether this scene is active or not (TODO: check if I need this, phaser should handle this by itself)
  protected active = true;

  constructor(
    scene: BaseScene,
    world: GameWorld,
    renderManager: EntityRenderManager,
  ) {
    this.scene = scene;
    this.world = world;
    this.renderManager = renderManager;
    this.backgroundArtManager = new BackgroundArtManager(scene);
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
    this.backgroundArtManager.destroy();
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
    this.indicator.setSimulateShotCallback((tn) => this.simManager.runSimulation(tn, {numSteps: GHOST_SHOT_STEPS, buffer: this.indicator.getBuffer()}))
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
