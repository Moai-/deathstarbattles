import { GameWorld } from 'shared/src/ecs/world';
import { GameObjectManager } from '../render/objectManager';
import { FiringIndicator } from './firingIndicator';
import { PlayerInputHandler } from './playerInput';
import { ProjectileManager } from './projectileManager';
import { CollisionHandler } from './collisionHandler';
import {
  GameState,
} from 'shared/src/types';
import {
  doCirclesOverlap,
  getPosition,
  getRadius,
  noop,
  setPosition,
} from 'shared/src/utils';
import { SimManager } from 'shared/src/ai/simulation/manager';
import { EditorScene } from './editorScene';
import { createRandomAsteroid } from 'src/entities/asteroid';
import { defineQuery, getAllEntities, removeEntity, resetWorld } from 'bitecs';
import { Position } from 'shared/src/ecs/components';
import { gameBus, GameEvents } from 'src/util';

const positionedEntities = defineQuery([Position]);

export default class EditorManager {
  // globals
  private scene: EditorScene;
  private world: GameWorld;

  // game components
  private indicator: FiringIndicator;
  private inputHandler: PlayerInputHandler;
  private collisionHandler: CollisionHandler;
  private projectileManager: ProjectileManager;
  private objectManager: GameObjectManager;
  private simManager: SimManager;

  constructor(
    scene: EditorScene,
    world: GameWorld,
    objectManager: GameObjectManager,
  ) {
    this.scene = scene;
    this.world = world;
    this.objectManager = objectManager;
    this.indicator = new FiringIndicator(scene);
    this.projectileManager = new ProjectileManager(world);
    this.simManager = new SimManager();
    this.collisionHandler = new CollisionHandler(world, scene);
    this.inputHandler = new PlayerInputHandler();
  }

  create() {
    this.clearECS();
    this.indicator.create();
    this.inputHandler.create();
    this.setUpListeners();
  }

  destroy() {
    this.clearListeners();
    this.indicator.destroy();
    this.inputHandler.destroy();
    this.projectileManager.destroy();
  }

  ready() {
    this.enableClickListeners();
  }

  addEntity() {
    const eid = createRandomAsteroid(this.world);
    setPosition(eid, {x: 500, y: 500})
  }

  onCollision(eid1: number, eid2: number, wasDestroyed: boolean) {
    return this.collisionHandler.handleCollision(eid1, eid2, wasDestroyed);
  }

  onCleanup(eid: number) {
    this.projectileManager.removeProjectile(eid);
  }

  private enableClickListeners() {
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointermove', this.handlePointerMove, this);
    this.scene.input.on('pointerup', this.handlePointerUp, this);
    this.scene.input.on('pointerupoutside', this.handlePointerUp, this);
  }

  private disableClickListeners() {
    this.scene.input.off('pointerdown');
    this.scene.input.off('pointermove');
    this.scene.input.off('pointerup');
    this.scene.input.off('pointerupoutside');
  }

  private handlePointerDown(pointer: Phaser.Input.Pointer) {
    const ent = positionedEntities(this.world);
    const overlappingEntities: Array<number> = [];
    for (let i = 0; i < ent.length; i++) {
      const entity = ent[i];
      const pos = getPosition(entity);
      const rad = getRadius(entity) || 5;
      if (doCirclesOverlap(pointer.x, pointer.y, 2, pos.x, pos.y, rad)) {
        overlappingEntities.push(entity);
      }
    }
    gameBus.emit(GameEvents.ED_ENTITY_CLICKED, overlappingEntities);
  }

  private handlePointerMove() {

  }

  private handlePointerUp() {

  }

  private setUpListeners() {
    // Set a tiny delay on post combat phase to allow collision manager
    // to properly resolve all destroyed stations
    this.projectileManager.setCleanupCallback(() => {
      // Currently blank
    });
    this.projectileManager.setSingleCleanupCallback((eid) =>
      this.objectManager.removeBoundaryIndicator(eid!),
    );
    this.collisionHandler.setProjectileDestroyedCallback((eid) => {
      this.projectileManager.removeProjectile(eid);
      this.objectManager.removeBoundaryIndicator(eid);
    });
    this.collisionHandler.setTargetDestroyedCallback((eid) => {
      // Currently blank
    });
    this.inputHandler.setOnEndTurnCallback(() => {
      // Currently blank
    });
    this.indicator.setGetTargetIdCallback(
      () => {
        // Currently blank
        return 1;
      }
    );
    this.indicator.setAnglePowerListener((angle, power) =>
      this.inputHandler.setAnglePower(angle, power),
    );

  }

  private clearListeners() {
    this.projectileManager.setCleanupCallback(noop);
    this.projectileManager.setSingleCleanupCallback(noop);
    this.collisionHandler.setProjectileDestroyedCallback(noop);
    this.collisionHandler.setTargetDestroyedCallback(noop);
    this.inputHandler.setOnEndTurnCallback(noop);
    this.indicator.setAnglePowerListener(noop);
    this.indicator.setGetTargetIdCallback(() => 0);
    this.disableClickListeners();
  }

  private clearECS() {
    getAllEntities(this.world).forEach((ent) => removeEntity(this.world, ent));
    this.world = resetWorld(this.world);
  }

  getGameState() {
    return {
      lastTurnShots: this.world.movements,
    } as GameState;
  }
}
