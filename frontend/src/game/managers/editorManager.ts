import {
  GameState,
} from 'shared/src/types';
import {
  doCirclesOverlap,
  getComponentName,
  getPosition,
  getRadius,
  serializeComponents,
  setPosition,
} from 'shared/src/utils';
import { NULL_ENTITY } from 'shared/src/ecs/world';
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
import { getSoundManager } from '../scenes/resourceScene';
import * as ecsComponents from 'shared/src/ecs/components';
import { getDeathStarSizeIndex, getRemovedDestructibleEids, clearRemovedDestructibleEids, addRemovedDestructibleEid, getPersistTrails, getLabelTrails, getShotHistory, recordShot } from 'src/ui/components/editor';
import { BaseSceneManager } from './baseSceneManager';

type PlacementState =
  | { mode: 'add'; objectType: ObjectTypes; ghostEid: number }
  | { mode: 'move'; eid: number; originalX: number; originalY: number }
  | null;


// This manager handles the editor. It can't really play the game,
// although there are a few functions that allow it to execute
// functions found in the game (like firing a shot)
export class EditorManager extends BaseSceneManager {

  // editor state
  private placementState: PlacementState = null;
  private escapeKey: Phaser.Input.Keyboard.Key | null = null;
  private shiftKey: Phaser.Input.Keyboard.Key | null = null;
  private firingFromEid: number | null = null;
  private lastAngle = 90;
  private lastPower = 50;

  private static posQuery = [Position];

  ready() {
    super.ready();
    this.enableClickListeners();
    this.escapeKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC) ?? null;
    this.shiftKey = this.scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT) ?? null;
  }

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
      const objectType = this.placementState.objectType;
      setPosition(eid, { x, y });
      if (ObjectInfo.type[eid] === ObjectTypes.DEATHSTAR) {
        const multiplier = getDeathStarSizeIndex() + 1;
        Collision.radius[eid] = DEFAULT_DEATHSTAR_RADIUS * multiplier;
        this.objectManager.refreshObject(eid);
      }
      this.objectManager.setGhost(eid, false);
      this.placementState = null;
      if (this.shiftKey?.isDown) {
        this.startPlaceEntity(objectType);
      }
    } else {
      setPosition(this.placementState.eid, { x, y });
      this.objectManager.setGhost(this.placementState.eid, false);
      this.placementState = null;
    }
  }

  private enableClickListeners() {
    this.scene.input.on('pointerdown', this.handlePointerDown, this);
    this.scene.input.on('pointermove', this.handlePointerMove, this);
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

  protected setUpListeners() {
    const {objectManager, projectileManager, inputHandler} = this;
    super.setUpListeners({
      singleCleanupCallback: (eid) => objectManager.removeBoundaryIndicator(eid!),
      projectileDestroyedCallback: (eid) => {
        projectileManager.removeProjectile(eid);
        objectManager.removeBoundaryIndicator(eid);
      }
    })

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

  protected clearListeners() {
    super.clearListeners();
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

  getGameState() {
    return {
      lastTurnShots: this.world.movements,
    } as GameState;
  }

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

  private syncAnglePower(angle: number, power: number) {
    this.inputHandler.setAnglePower(angle, power);
    this.indicator.updateVector(angle, power);
  }

  private confirmFireShot(eid: number, angle: number, power: number) {
    this.lastAngle = angle;
    this.lastPower = power;
    const projEid = Player.pooledProjectile[eid];
    if (!getPersistTrails() && projEid !== undefined) {
      this.objectManager.removeChildren(projEid);
    }
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
