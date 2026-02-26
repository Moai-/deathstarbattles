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
  getComponentName,
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
import { query, getAllEntities, removeEntity, getEntityComponents, removeComponent, addComponent, hasComponent, entityExists } from 'bitecs';
import { ObjectTypes } from 'shared/src/types';
import { Position } from 'shared/src/ecs/components';
import { Collision } from 'shared/src/ecs/components';
import { ObjectInfo } from 'shared/src/ecs/components/objectInfo';
import { Player } from 'shared/src/ecs/components/player';
import { Projectile } from 'shared/src/ecs/components/projectile';
import { Destructible } from 'shared/src/ecs/components/destructible';
import { Active } from 'shared/src/ecs/components/active';
import { LeavesTrail } from 'src/render/components/leavesTrail';
import { colToUi32 } from 'shared/src/utils';
import { playerCols } from 'shared/src/utils/colour';
import { DEFAULT_DEATHSTAR_RADIUS } from 'src/entities/deathStar';

import { gameBus, GameEvents } from 'src/util';
import { setEditorBackground } from 'src/render/background';
import { getSoundManager } from './resourceScene';
import * as ecsComponents from 'shared/src/ecs/components';
import { getDeathStarSizeIndex, getRemovedDestructibleEids, clearRemovedDestructibleEids, addRemovedDestructibleEid, getPersistTrails, getLabelTrails, getShotHistory, recordShot } from 'src/ui/components/editor';

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
  /** When set, we are in "fire shot" mode for this Death Star eid. */
  private firingFromEid: number | null = null;
  /** Persisted angle/power between firing shots. */
  private lastAngle = 90;
  private lastPower = 50;

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

  /** Called from EditorScene each frame; handles Escape to abort placement or fire mode. */
  update() {
    if (this.escapeKey?.isDown) {
      if (this.placementState) {
        this.abortPlacement();
        gameBus.emit(GameEvents.ED_PH_ABORT_PLACE);
      } else if (this.firingFromEid !== null) {
        this.exitFireMode();
      }
    }
  }

  /** Start placement mode: ghost follows pointer until left-click (place) or right-click/escape (abort). */
  startPlaceEntity(objectType: ObjectTypes) {
    const creator = createRandom[objectType];
    if (!creator) return;
    const eid = creator(this.world);
    if (eid === NULL_ENTITY) return;
    if (ObjectInfo.type[eid] === ObjectTypes.DEATHSTAR) {
      const multiplier = getDeathStarSizeIndex() + 1;
      Collision.radius[eid] = DEFAULT_DEATHSTAR_RADIUS * multiplier;
    }
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
      const eid = this.placementState.ghostEid;
      setPosition(eid, { x, y });
      if (ObjectInfo.type[eid] === ObjectTypes.DEATHSTAR) {
        const multiplier = getDeathStarSizeIndex() + 1;
        Collision.radius[eid] = DEFAULT_DEATHSTAR_RADIUS * multiplier;
        this.objectManager.refreshObject(eid);
      }
      this.objectManager.setGhost(eid, false);
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
    if (this.placementState) {
      const eid = this.placementState.mode === 'add' ? this.placementState.ghostEid : this.placementState.eid;
      setPosition(eid, { x: pointer.x, y: pointer.y });
      this.objectManager.updateObjectPosition(eid, pointer.x, pointer.y);
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
    gameBus.emit(GameEvents.ED_ENTITY_HOVERED, {
      clickLoc: { x: pointer.x, y: pointer.y },
      entities: overlappingEntities.map((eid) => serializeComponents(this.world, eid)),
    });
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
    gameBus.on(GameEvents.ED_UI_REMOVE_COMPONENT, ({ eid, compKey }) => {
      this.removeEntityComponent(eid, compKey);
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
    gameBus.on(GameEvents.ED_UI_START_FIRE_SHOT, ({ eid }) => this.startFireShot(eid));
    gameBus.on(GameEvents.ED_UI_FIRE_SHOT_CONFIRM, ({ eid, angle, power }) =>
      this.confirmFireShot(eid, angle, power),
    );
    gameBus.on(GameEvents.ED_UI_FIRE_SHOT_CANCEL, () => this.exitFireMode());
    gameBus.on(GameEvents.ED_UI_CLEAR_TRAILS, () => this.clearAllTrails());
    gameBus.on(GameEvents.ED_UI_OPTIONS_DEATHSTAR_SIZE, ({ sizeIndex }) =>
      this.applyDeathStarSize(sizeIndex),
    );
    gameBus.on(GameEvents.ED_UI_OPTIONS_ALL_DESTRUCTIBLE, ({ enabled }) =>
      this.setAllDestructible(enabled),
    );
    gameBus.on(GameEvents.ED_UI_OPTIONS_BACKGROUND, ({ bgType }) =>
      setEditorBackground(this.scene, bgType),
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
    gameBus.off(GameEvents.ED_UI_PROP_CHANGED);
    gameBus.off(GameEvents.ED_UI_DELETE_ENTITY);
    gameBus.off(GameEvents.ED_UI_REMOVE_COMPONENT);
    gameBus.off(GameEvents.ED_UI_START_PLACE_ENTITY);
    gameBus.off(GameEvents.ED_UI_START_MOVE_ENTITY);
    gameBus.off(GameEvents.ED_UI_ABORT_PLACE);
    gameBus.off(GameEvents.ED_PH_ABORT_PLACE);
    gameBus.off(GameEvents.ED_UI_START_FIRE_SHOT);
    gameBus.off(GameEvents.ED_UI_FIRE_SHOT_CONFIRM);
    gameBus.off(GameEvents.ED_UI_FIRE_SHOT_CANCEL);
    gameBus.off(GameEvents.ED_UI_CLEAR_TRAILS);
    gameBus.off(GameEvents.ED_UI_OPTIONS_DEATHSTAR_SIZE);
    gameBus.off(GameEvents.ED_UI_OPTIONS_ALL_DESTRUCTIBLE);
    gameBus.off(GameEvents.ED_UI_OPTIONS_BACKGROUND);
    this.disableClickListeners();
  }

  private static projectileQuery = [Projectile];

  private clearAllTrails() {
    const projectiles = query(this.world, EditorManager.projectileQuery);
    for (const projEid of projectiles) {
      this.objectManager.removeChildren(projEid);
    }
  }

  private applyDeathStarSize(sizeIndex: number) {
    const multiplier = sizeIndex + 1;
    const eids = getAllEntities(this.world);
    for (const eid of eids) {
      if (ObjectInfo.type[eid] === ObjectTypes.DEATHSTAR) {
        Collision.radius[eid] = DEFAULT_DEATHSTAR_RADIUS * multiplier;
        this.objectManager.refreshObject(eid);
      }
    }
  }

  private setAllDestructible(enabled: boolean) {
    const eids = getAllEntities(this.world);
    if (enabled) {
      for (const eid of Array.from(getRemovedDestructibleEids())) {
        if (entityExists(this.world, eid)) {
          addComponent(this.world, eid, Destructible);
          this.objectManager.refreshObject(eid);
        }
      }
      clearRemovedDestructibleEids();
    } else {
      for (const eid of eids) {
        if (hasComponent(this.world, eid, Active) && hasComponent(this.world, eid, Destructible)) {
          removeComponent(this.world, eid, Destructible);
          addRemovedDestructibleEid(eid);
          this.objectManager.refreshObject(eid);
        }
      }
    }
  }

  private clearECS() {
    getAllEntities(this.world).forEach((ent) => void(removeEntity(this.world, ent)));
  }

  getGameState() {
    return {
      lastTurnShots: this.world.movements,
    } as GameState;
  }

  /** Enter fire-shot mode: show Phaser indicator for the given Death Star eid. */
  private startFireShot(eid: number) {
    this.firingFromEid = eid;
    this.indicator.radius = 30 * (Collision.radius[eid] / 8);
    this.indicator.setGetTargetIdCallback(() => this.firingFromEid ?? 0);
    this.indicator.drawIndicator();
    this.syncAnglePower(this.lastAngle, this.lastPower);
    const { x, y } = getPosition(eid);
    gameBus.emit(GameEvents.ED_FIRE_SHOT_READY, {
      eid,
      x,
      y,
      indicatorRadius: this.indicator.radius,
      initialAngle: this.lastAngle,
      initialPower: this.lastPower,
    });
  }

  /** Sync angle/power to input handler and indicator (same as game). */
  private syncAnglePower(angle: number, power: number) {
    this.inputHandler.setAnglePower(angle, power);
    this.indicator.updateVector(angle, power);
  }

  /** Fire the shot, remove indicator, play sound, exit fire mode. */
  private confirmFireShot(eid: number, angle: number, power: number) {
    this.lastAngle = angle;
    this.lastPower = power;
    const projEid = Player.pooledProjectile[eid];
    if (!getPersistTrails() && projEid !== undefined) {
      this.objectManager.removeChildren(projEid);
    }
    // When persist is on we do not clear trails; trail.ts will dim previous trail
    if (getLabelTrails() && projEid !== undefined) {
      const history = getShotHistory(eid);
      const colorIndex = history.length % playerCols.length;
      const trailColor = playerCols[colorIndex];
      LeavesTrail.col[projEid] = colToUi32(trailColor);
      recordShot(eid, angle, power, trailColor);
    }
    this.projectileManager.fireFrom(eid, angle, power);
    this.exitFireMode();
    const sm = getSoundManager(this.scene);
    sm.playSound('laserShot');
    sm.playSound('elecTravelHum');
  }

  /** Remove indicator and clear fire mode; notify UI. */
  private exitFireMode() {
    this.indicator.removeIndicator();
    this.firingFromEid = null;
    this.indicator.setGetTargetIdCallback(() => 0);
    gameBus.emit(GameEvents.ED_FIRE_MODE_EXITED);
  }

  private static componentByName: Record<string, object> | null = null;

  private static getComponentByName(key: string): object | undefined {
    if (EditorManager.componentByName === null) {
      EditorManager.componentByName = {};
      for (const comp of Object.values(ecsComponents)) {
        if (comp && typeof comp === 'object') {
          const name = getComponentName(comp as object);
          if (name) EditorManager.componentByName[name] = comp as object;
        }
      }
    }
    return EditorManager.componentByName[key];
  }

  private removeEntityComponent(eid: number, compKey: string) {
    const comp = EditorManager.getComponentByName(compKey);
    if (!comp) return;
    removeComponent(this.world, eid, comp);
    this.objectManager.refreshObject(eid);
    const serialized = serializeComponents(this.world, eid);
    gameBus.emit(GameEvents.ED_PH_COMPONENT_REMOVED, {
      eid,
      name: serialized.name,
      components: serialized.components,
    });
  }
}
