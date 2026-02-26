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
  serializeComponents,
  setPosition,
} from 'shared/src/utils';
import { NULL_ENTITY } from 'shared/src/ecs/world';
import { SimManager } from 'shared/src/ai/simulation/manager';
import { EditorScene } from './editorScene';
import { createRandom } from 'src/entities';
import { query, getAllEntities, removeEntity, getEntityComponents } from 'bitecs';
import { ObjectTypes } from 'shared/src/types';
import { Position } from 'shared/src/ecs/components';
import { gameBus, GameEvents } from 'src/util';

type PlacementState =
  | { mode: 'add'; objectType: ObjectTypes; ghostEid: number }
  | { mode: 'move'; eid: number; originalX: number; originalY: number }
  | null;

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

  // editor state
  private placementState: PlacementState = null;
  private escapeKey: Phaser.Input.Keyboard.Key | null = null;

  private static posQuery = [Position];

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
    this.escapeKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC) ?? null;
  }

  /** Called from EditorScene each frame; handles Escape to abort placement. */
  update() {
    if (this.placementState && this.escapeKey?.isDown) {
      this.abortPlacement();
      gameBus.emit(GameEvents.ED_PH_ABORT_PLACE);
    }
  }

  /** Start placement mode: ghost follows pointer until left-click (place) or right-click/escape (abort). */
  startPlaceEntity(objectType: ObjectTypes) {
    const creator = createRandom[objectType];
    if (!creator) return;
    const eid = creator(this.world);
    if (eid === NULL_ENTITY) return;
    this.objectManager.setPendingGhostEid(eid);
    setPosition(eid, { x: 0, y: 0 });
    this.placementState = { mode: 'add', objectType, ghostEid: eid };
  }

  /** Start move mode: entity ghost follows pointer until left-click (commit) or right-click/escape (abort). */
  startMoveEntity(eid: number) {
    const pos = getPosition(eid);
    this.objectManager.setGhost(eid, true);
    this.placementState = { mode: 'move', eid, originalX: pos.x, originalY: pos.y };
  }

  private abortPlacement() {
    if (!this.placementState) return;
    if (this.placementState.mode === 'add') {
      removeEntity(this.world, this.placementState.ghostEid);
      this.objectManager.removeObject(this.placementState.ghostEid);
    } else {
      setPosition(this.placementState.eid, {
        x: this.placementState.originalX,
        y: this.placementState.originalY,
      });
      this.objectManager.setGhost(this.placementState.eid, false);
    }
    this.placementState = null;
  }

  private commitPlacement(x: number, y: number) {
    if (!this.placementState) return;
    if (this.placementState.mode === 'add') {
      setPosition(this.placementState.ghostEid, { x, y });
      this.objectManager.setGhost(this.placementState.ghostEid, false);
    } else {
      setPosition(this.placementState.eid, { x, y });
      this.objectManager.setGhost(this.placementState.eid, false);
    }
    this.placementState = null;
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
    if (this.placementState) {
      if (pointer.rightButtonDown()) {
        this.abortPlacement();
        gameBus.emit(GameEvents.ED_PH_ABORT_PLACE);
      } else if (pointer.leftButtonDown()) {
        this.commitPlacement(pointer.x, pointer.y);
      }
      return;
    }
    const ent = query(this.world, EditorManager.posQuery);
    const overlappingEntities: Array<number> = [];
    for (let i = 0; i < ent.length; i++) {
      const entity = ent[i];
      const pos = getPosition(entity);
      const rad = getRadius(entity) || 5;
      if (doCirclesOverlap(pointer.x, pointer.y, 2, pos.x, pos.y, rad)) {
        overlappingEntities.push(entity);
      }
    }
    const payload = {
      clickLoc: { x: pointer.x, y: pointer.y },
      entities: overlappingEntities.map((eid) => serializeComponents(this.world, eid)),
    };
    gameBus.emit(GameEvents.ED_ENTITY_CLICKED, payload);
  }

  private handlePointerMove(pointer: Phaser.Input.Pointer) {
    if (!this.placementState) return;
    const eid = this.placementState.mode === 'add' ? this.placementState.ghostEid : this.placementState.eid;
    setPosition(eid, { x: pointer.x, y: pointer.y });
    this.objectManager.updateObjectPosition(eid, pointer.x, pointer.y);
  }

  private handlePointerUp() {}

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
    gameBus.on(GameEvents.ED_UI_PROP_CHANGED, ({eid, compIdx, propName, newVal}) => {
      const thisComp = getEntityComponents(this.world, eid)[compIdx];
      if (thisComp) {
        thisComp[propName][eid] = newVal;
        this.objectManager.refreshObject(eid);
      }
    });

    gameBus.on(GameEvents.ED_UI_DELETE_ENTITY, ({ eid }) => {
      removeEntity(this.world, eid);
      gameBus.emit(GameEvents.ED_PH_DELETE_ENTITY, { eid });
    });

    gameBus.on(GameEvents.ED_UI_START_PLACE_ENTITY, ({ objectType }) => {
      this.startPlaceEntity(objectType);
    });
    gameBus.on(GameEvents.ED_UI_START_MOVE_ENTITY, ({ eid }) => {
      this.startMoveEntity(eid);
    });
    const onAbortPlace = () => this.abortPlacement();
    gameBus.on(GameEvents.ED_UI_ABORT_PLACE, onAbortPlace);
    gameBus.on(GameEvents.ED_PH_ABORT_PLACE, onAbortPlace);
  }

  private clearListeners() {
    this.projectileManager.setCleanupCallback(noop);
    this.projectileManager.setSingleCleanupCallback(noop);
    this.collisionHandler.setProjectileDestroyedCallback(noop);
    this.collisionHandler.setTargetDestroyedCallback(noop);
    this.inputHandler.setOnEndTurnCallback(noop);
    this.indicator.setAnglePowerListener(noop);
    this.indicator.setGetTargetIdCallback(() => 0);
    gameBus.off(GameEvents.ED_UI_PROP_CHANGED);
    gameBus.off(GameEvents.ED_UI_DELETE_ENTITY);
    gameBus.off(GameEvents.ED_UI_START_PLACE_ENTITY);
    gameBus.off(GameEvents.ED_UI_START_MOVE_ENTITY);
    gameBus.off(GameEvents.ED_UI_ABORT_PLACE);
    gameBus.off(GameEvents.ED_PH_ABORT_PLACE);
    this.disableClickListeners();
  }

  private clearECS() {
    getAllEntities(this.world).forEach((ent) => void(removeEntity(this.world, ent)));
  }

  getGameState() {
    return {
      lastTurnShots: this.world.movements,
    } as GameState;
  }
}
